export const LoginForm = () => {
//     const handleSubmit = async (event: any) => {
//     event.preventDefault();
//     const { name, email } = event.target.elements;

//     // Calls the login function
//     await login(name.value, email.value);
//     };

//     async function login(name: any, email: any) {
//         try {
//           // POST request to login endpoint  
//           const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', {
//             name,
//             email
//           },{withCredentials: true});
    
//           if (response.status === 200) {
//             // Set the 'authenticated' flag in session storage, to be used throughout the app
//             sessionStorage.setItem('authenticated', 'true');
//             setAuthenticated(true);
//             navigate('/home');
//           }
//         } catch (error) {
//           console.error(error);
//           alert('Invalid credentials. Please try again');
//         }
//     }

// return (
//   <div className="container d-flex justify-content-center">
//     <form onSubmit={handleSubmit} className="text-center">
//       <div className="form-group">
//         <label htmlFor="name">Name</label>
//         <input type="text" id="name" name="name" className="form-control" placeholder="Name" />
//       </div>
//       <div className="form-group">
//         <label htmlFor="email">Email</label>
//         <input type="email" id="email" name="email" className="form-control" placeholder="Email" />
//       </div>
//       <div className="form-group">
//         <span className="form-text text-muted">
//           <button type="submit" className="btn btn-primary logout-button">
//             Login
//           </button>
//         </span>
//       </div>
//     </form>
//   </div>
// );
};