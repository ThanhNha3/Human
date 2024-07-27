import { Component, HostListener, OnInit } from '@angular/core';
import { AdminService } from 'src/app/@core/service/admin.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit {
  sicknesses: any[] = [];
  userByAgeGroup: any[] = [];
  averageByAgeGroup: any[] = [];

  tab: string = 'sickness';

  // selectedChart: any[] = this.sicknesses[0].data;
  selectedChart: any[] = [];
  selectedChartIndex: number = 0;

  view: [number, number] = [700, 400];

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const width = window.innerWidth;
    if (width < 600) {
      this.view = [300, 200];
    } else if (width < 960) {
      this.view = [500, 300];
    } else {
      this.view = [600, 400];
    }
  }

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#66FF99', '#00CCFF', '#FF0000', '#FFFF66', '#FF99CC', '#66FF33', '#FF6600', '#FFCC00', '#FF99FF', '#FF6666'],
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    Promise.all([
      this.findMostSickness(),
      this.findUserByAgeGroup(),
      this.getAverageByAgeGroup(),
    ])
      .then(([mostSicknessByAgeGroup, userByAgeGroup, averageByAgeGroup]) => {
        // console.log('Most Sickness By Age Group:', mostSicknessByAgeGroup);
        // console.log('User By Age Group:', userByAgeGroup);
        // console.log('Average By Age Group:', averageByAgeGroup);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onChartChange(index: number): void {
    this.selectedChartIndex = index;
    this.selectedChart = this.sicknesses[index].series;
  }

  findMostSickness() {
    this.adminService.findMostSicknessByAgeGroup().subscribe((res) => {
      this.sicknesses = res.data;
      this.sicknesses = this.sicknesses.map((group) => ({
        name: group.age_group,
        series: group.sickness.map((sick: any) => ({
          name: sick.sickness_name,
          value: sick.number_of_people,
        })),
      }));
      this.selectedChart = this.sicknesses[0].series;
    });
  }

  findUserByAgeGroup() {
    this.adminService.findUserByAgeGroup().subscribe((res) => {
      console.log(res);
      this.userByAgeGroup = res.data;
      this.userByAgeGroup = this.userByAgeGroup.map((group) => ({
        name: group.age_group,
        value: group.total_users,
      }));
      console.log(this.userByAgeGroup);
    });
  }

  getAverageByAgeGroup() {
    this.adminService.getAverageByAgeGroup().subscribe((res) => {
      console.log(res);
      this.averageByAgeGroup = res.data;
      this.averageByAgeGroup = this.averageByAgeGroup.map((group) => ({
        name: group.age_group,
        value: group.average_visits,
      }));
      console.log(this.averageByAgeGroup);
    });
  }

  changeTab(tab: string) {
    this.tab = tab;
  }
}
