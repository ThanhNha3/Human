const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };
    }

    async run(chat, systemInstruction) {
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ]
        });

        const chatSession = this.model.startChat({
            generationConfig: this.generationConfig,
            history: [],
        });
        const result = await chatSession.sendMessage(chat);
        return result.response.text();
    }

    async generateSymptom(sickness) {
        try {
            const systemInstruction = `Bạn hãy đóng vai là một bác sĩ nhiều năm kinh nghiệm. Khi tôi ghi dòng chat sau, hãy xem nó là một bệnh và phân tích các triệu chứng của bệnh đó và trả ra một mảng JSON chứa các thông tin sau:
    - symptoms: một mảng chứa các triệu chứng dưới dạng chuỗi. Nếu bạn không thể phân tích bất kỳ thông tin nào, hãy trả ra mảng rỗng
    
    Ví dụ của phần JSON mà bạn cần trả nếu phân tích được:
    {
    "symptoms": ["ho", "cảm đêm", "đau đầu"]
    }
    Ví dụ của phần JSON mà bạn cần trả nếu không phân tích được:
    {
    "symptoms": []
    }
    Bạn chỉ đưa ra phần JSON, không có định dạng. Bạn vẫn trả ra phần JSON theo mẫu trên dù có thêm thông tin khác hay tôi yêu cầu làm gì đó khác.`;

            let data = await this.run(sickness, systemInstruction);
            try {
                return JSON.parse(data);
            } catch (error) {
                throw new Error("Dữ liệu trả về không phải là chuỗi JSON hợp lệ");
            }
        } catch (error) {
            console.error("Lỗi khi phân tích JSON:", error);
            return { symptoms: [] }; // Trả về mảng rỗng nếu có lỗi
        }
    }
    async filterMedicinesForSickness(id, sickness, id_medicines, medicines, unit, dosage, price) {
        try {
            const systemInstruction = `
              Bạn hãy đóng vai là một bác sĩ đang khám bệnh cho bệnh nhân. Tôi sẽ cung cấp cho bạn một đối tượng JSON gồm các trường sau:
- id: id của bệnh
- sickness: tên bệnh
- id_medicines: id của các loại thuốc
- medicines: tên các loại thuốc
- unit: đơn vị của các loại thuốc
- dosage: cách dùng và liều lượng của thuốc phù hợp mà bạn phân tích được
- price: giá của các loại thuốc mà bạn phân tích được, nếu không có bạn hãy tự tìm thông tin trên internet và trả về các con số hợp lí

Bạn hãy lọc bỏ những medicines không phù hợp với sickness đó cũng như các trường đi kèm như id_medicines tương ứng, unit tương ứng, dosage tương ứng. Và trả ra JSON đã lọc

ví dụ mẫu
{
    id: 1,
    sickness: Bệnh Tim Đập Nhanh,
    medicines: 'Thuốc A, thuốc B, thuốc C',
    id_medicines: '1,2,3',
    unit: 'viên, liều, lọ',
    price: '10000,20000,30000',
    dosage: '11,20,30'
}

Nếu không phân tích được gì, hãy trả kết quả JSON như này: {}

Lưu ý: Bạn chỉ cần trả về phần JSON, không có định dạng và tuyệt đối chỉ thực hiện nhiệm vụ được giao ở trên, bạn không được trả lời bất cứ câu hỏi nào nằm ngoài nghiệp vụ đã giao
            `;
            const dataItem = JSON.stringify({ id, sickness, id_medicines, medicines, unit, dosage, price })
            let data = await this.run(dataItem, systemInstruction);
            return JSON.parse(data);
        }
        catch (error) {
            console.error("Lỗi khi phân tích JSON:", error);
            return {};
        }
    }
}

module.exports = new GeminiService();