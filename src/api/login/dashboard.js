const dashboardHandler = async (request, h) => {
    const { user } = request.auth.credentials;
  
    return { message: `Selamat datang di dashboard, ${user.username}!` };
  };
  
  module.exports = dashboardHandler;
  