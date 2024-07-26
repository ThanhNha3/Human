import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit {
  multiple: any[] = [
    {
      name: '0 - 9',
      data: [
        { name: 'Bệnh A', value: 9 },
        { name: 'Bệnh G', value: 4 },
        { name: 'Bệnh H', value: 3 },
      ],
    },
    {
      name: '10 - 19',
      data: [
        { name: 'Bệnh A', value: 15 },
        { name: 'Bệnh B', value: 10 },
        { name: 'Bệnh C', value: 6 },
      ],
    },
    {
      name: '20 - 29',
      data: [
        { name: 'Bệnh A', value: 30 },
        { name: 'Bệnh E', value: 10 },
        { name: 'Bệnh F', value: 5 },
      ],
    },
  ];

  selectedChart: any[] = this.multiple[0].data;

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
      this.view = [700, 400];
    }
  }

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {}

  ngOnInit(): void {}

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
    this.selectedChart = this.multiple[index].data;
  }
}
