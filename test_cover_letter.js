

async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/cover-letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                masterProfile: { fullName: 'John Doe', experience: [] },
                jobDescription: 'Software Engineer at Google',
                targetLanguage: 'English'
            })
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch(e) {
        console.error(e);
    }
}
test();
