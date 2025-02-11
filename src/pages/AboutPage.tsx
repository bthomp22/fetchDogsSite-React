import React from "react";
import ProfilePic from "../assets/profilepic.jpg"; 

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-3xl font-bold">About the Author</h1>
      <div className="mt-6 w-64 h-64 bg-gray-300 flex items-center justify-center rounded-full overflow-hidden">
        <img src={ProfilePic} alt="Profile" className="w-full h-full object-cover" />
      </div>
      <p className="mt-4 text-lg text-center text-gray-700 max-w-xl">
        Hi, I'm Brent Thompson, a software developer from Raleigh, N.C. that is passionate about both my career and my personal life. 
        I am happily married to my wonderful wife, Bailey, and together, we share our home with two adorable French Bulldogs—Bonnie and Clyde—who are truly our fur children and are thick as thieves! 
        <br /><br />
        When I'm not working or spending time with my family, I enjoy a round of golf or casting a line out while fishing. 
        I’m also a huge sports fan, keeping up with football, basketball, and golf, and I’m always excited about the latest developments in the TGL.
        <br /><br />
        I’m excited for the opportunity to explore how my skills could align with Fetch’s mission, and I look forward to learning more about the role and the team during this interview process! 
      </p>
    </div>
  );
};

export default AboutPage;