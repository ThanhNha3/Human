class LangchainService {
    async create(roughSymptom, document) {
        try {
            console.log("roughSymptom", roughSymptom);
            console.log("document", document);
            const result = await fetch(`${process.env.LANGCHAIN_API_URL}/generateSpecializedSymptoms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roughSymptom, document })
            });
            return result.json();
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
module.exports = new LangchainService();
