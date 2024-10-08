import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import BaoBao from '../../../images/BaoBao.jpg';
import BinhTri from '../../../images/BinhTri.jpg';
import ThanhDuy from '../../../images/ThanhDuy.jpg';
import ThiMay from '../../../images/ThiMay.jpg';
import ThanhPhuc from '../../../images/ThanhPhuc.jpg';
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/meabhisingh";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar 
                style={{ width: "5vmax", height: "5vmax", margin: "2vmax 0" }}
                src={BaoBao}
            />
            <Typography component="h2">Hồng Bảo Bảo</Typography>
          </div>
          <div>
            <Avatar 
                style={{ width: "5vmax", height: "5vmax", margin: "2vmax 0" }}
                src={BinhTri}
            />
            <Typography component="h2">Hà Nguyễn Bình Trị</Typography>
          </div>
          <div>
            <Avatar 
                style={{ width: "5vmax", height: "5vmax", margin: "2vmax 0" }}
                src={ThanhDuy}
            />
            <Typography component="h2">Hồ Thanh Duy</Typography>
            <Typography component="h2">(Leader)</Typography>
          </div>
          <div>
            <Avatar 
                style={{ width: "5vmax", height: "5vmax", margin: "2vmax 0" }}
                src={ThiMay}
            />
            <Typography component="h2">Kim Thị Mây</Typography>
          </div>
          <div>
            <Avatar 
                style={{ width: "5vmax", height: "5vmax", margin: "2vmax 0" }}
                src={ThanhPhuc}
            />
            <Typography component="h2">Nguyễn Thanh Phúc</Typography>
          </div>
          {/* <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.youtube.com/channel/UCO7afj9AUo0zV69pqEYhcjw"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/meabhisingh" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default About;