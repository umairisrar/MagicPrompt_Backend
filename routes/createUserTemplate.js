export const createUserTemplate = (
  email,
  password,
  username,
  supportemail,
  senderemail,
  founder
) => `<!DOCTYPE html>
  
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PromptsGenii</title>
      <style>
          /* Add your email styles here */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333;
          }
          p {
              font-size: 16px;
              line-height: 1.5;
              color: #666;
          }
          .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
          }
          .footer {
              margin-top: 20px;
              text-align: center;
              color: #888;
          }
          .founder {
        
            line-height: 0.2;
      
          }
          .listyle {
            font-size: 14px;
            color: #141414;
          }
          .pstyle {
           
            color: #141414;
          }
          .pfounder {
            line-height: 0.7;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Welcome to PromptsGenii</h1>
          <p>Dear ${username},</p>
          <p>I hope this email finds you well. We are thrilled to welcome you to the PromptsGenii family! Thank you for choosing our extension to enhance your experience. 🚀</p>
          <p>To get started with PromptsGenii, we've set up your account and are excited to provide you with your login credentials:</p>
          <ul>
              <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p>To begin your creative journey, please follow these steps:</p>
          <ol>
              <li class = 'listyle'>If PromptsGenii is available on the Chrome Web Store, you can install it from there.</li>
              <li class = 'listyle'>Open Chrome and click on the extension icon in the upper right-hand corner.</li>
              <li class = 'listyle'>Log in using the email and password provided above.</li>
              <li class = 'listyle'>Explore the extension and start generating content prompts tailored to your needs.</li>
          </ol>
          <p>In case PromptsGenii is not yet available on the Chrome Web Store, we will send you the store link as soon as it becomes available. Rest assured, we're working diligently to make it accessible to you.</p>
          <p>Remember to change your password after your initial login for added security. You can do this by going to your account settings.</p>
          <p>We want to hear about your experience with PromptsGenii. Your feedback is invaluable as it helps us improve and cater to your needs better. Feel free to reach out to us anytime.</p>
          <p>Thank you once again for choosing PromptsGenii. We look forward to being a part of your creative journey!</p>
          <p>Happy writing!</p>
          <p>Warm regards,</p>
          <p class= 'founder'>${founder}</p>
          <p class= 'pfounder'>Founder, PromptsGenii</p>
          <p class= 'pstyle'>${senderemail}</p>
          <p class= 'pstyle'>promptsgenii.com/</p>
          <p class= 'pstyle'>${supportemail}</p>
      </div>
  </body>
  </html>
  
  `;
