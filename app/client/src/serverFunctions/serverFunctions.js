export async function handleLogin(){
    const userRefCurrent = usernameRef.current;
            const passwordRefCurrent = passwordRef.current;
            if (!userRefCurrent || !passwordRefCurrent) {
                console.error("Username or password reference is null");
                return;
            }
    
            fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                { 
                    usernameOrEmail: userRefCurrent.value, 
                    password: passwordRefCurrent.value 
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                };
                response.text().then((text) => {
                    console.log("Response data:", text); //logging jwt token
                    setCookie('jwt-token', text, { maxAge: 60 * 60 * 24 * 7 }); // Set cookie for 7 days
                    Router.replace('/');
                });        
            })
            .catch((error) => {
                console.error('Error:', error);
            });
}