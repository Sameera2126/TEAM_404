


async function testTranslation() {
    try {
        const response = await fetch('http://localhost:5000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Hello', targetLanguage: 'Spanish' })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Request failed:', error);
    }
}

testTranslation();
