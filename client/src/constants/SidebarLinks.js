
import home_icon_light from "@/assets/icons/home_light.png";
import home_icon_dark from "@/assets/icons/home_dark.png";

import search_icon_light from "@/assets/icons/search.png"; 
// No dark version for search

import compass_icon_light from "@/assets/icons/compass_light.svg";
import compass_icon_dark from "@/assets/icons/compass_dark.png";

import send_icon_light from "@/assets/icons/send_light.png";
import send_icon_dark from "@/assets/icons/send_dark.svg";

import like_icon_light from "@/assets/icons/like_light.png";
import like_icon_dark from "@/assets/icons/like_dark.png";

import add_icon_light from "@/assets/icons/add.png"; 

const SidebarLinks = [
  {
    name: "Home",
    href: "/",
    iconLight: home_icon_light,
    iconDark: home_icon_dark,
    isLink: true
  },
  {
    name: "Search",
    href: "/search",
    iconLight: search_icon_light,
    iconDark: null,
    isLink: true
  },
  {
    name: "Explore",
    href: "/explore",
    iconLight: compass_icon_light,
    iconDark: compass_icon_dark,
    isLink: true
  },
  {
    name: "Messages",
    href: "/messages",
    iconLight: send_icon_light,
    iconDark: send_icon_dark,
    isLink: true
  },
  {
    name: "Notifications",
    href: "/notifications",
    iconLight: like_icon_light,
    iconDark: like_icon_dark,
    isLink: true
  },
  {
    name: "Create",
    href: "/create",
    iconLight: add_icon_light,
    iconDark: null,
    isLink: false
  },
];

export default SidebarLinks; 