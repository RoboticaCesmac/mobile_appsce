import axios from 'axios';
import { IEvidencia } from '../interfaces/evidencia';
import { IAvaliacao } from '../interfaces/avaliacao';

const OPENAI_API_KEY = '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';

const directive1 = "Você é um especialista em identificar vieses cognitivos. Você possui acesso às seguintes informações vindas de um documento JSON. Leia o texto a seguir e responda as perguntas: ´´´"
const directive2 = `´´´Perguntas:
- Existe algum viés cognitivo presente? (Sim/Não)
- Quais são esses vieses? (Liste os tipos encontrados)
- Forneça uma breve justificativa para cada viés detectado.
- Estime um percentual geral do nível de viés cognitivo presente no texto (0% sem viés, 100% altamente enviesado).

Utilize as informações fornecidas para basear uma resposta. sua resposta deve organizar uma formatação html para ser exibida como um documento de texto, porém apenas os componentes (sem tags como doctype, meta, html, etc), não insira nenhum texto além do html (como ` + '"```html", "html", "```",' + ` etc).
`


export const analisarEvidencia = async (json: IAvaliacao | string) => {
    json = JSON.stringify(json);
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [{ role: 'user', content: directive1 + json + directive2 }],
                max_tokens: 1000, 
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao enviar prompt:', error);
        throw new Error('Erro ao processar a solicitação.');
    }
};
