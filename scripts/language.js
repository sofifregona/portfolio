import { projectService } from "../service/projectService.js";

var links = document.querySelectorAll(".nav-link");
var lang = "en"

if(window.location.href.includes("?lang=")){
    lang = window.location.href.split("?lang=")[1];
}

document.documentElement.lang = lang;

links.forEach(link => {
    link.href += lang;
});

var lang_num = 1;
if (lang == "es") lang_num = 0;
else if (lang == "it") lang_num = 2;

const about_me = document.querySelector("#about-me");
const my_work = document.querySelector("#my-work");
const contact_me = document.querySelector("#contact-me");
const language = document.querySelector(".lang-title");
const rights = document.querySelector(".rights");
const cv_button = document.querySelector(".cv-button");

const subtitle = document.querySelector(".subtitle");

projectService.general().then((response) => {
    about_me.innerHTML = response["about-me"][lang_num];
    my_work.innerHTML = response["my-work"][lang_num];
    contact_me.innerHTML = response["contact-me"][lang_num];
    language.innerHTML = response["language"][lang_num]+":";
    rights.innerHTML = response["rights"][lang_num];
    if (document.location.href.includes("index")) {
        subtitle.innerHTML = response["about-me"][lang_num].toUpperCase(); 
        const p_1 = document.querySelector("#p-1");
        const p_2 = document.querySelector("#p-2");
        const p_3 = document.querySelector("#p-3");
        p_1.innerHTML = response["about-me-text"][lang_num][0];
        p_2.innerHTML = response["about-me-text"][lang_num][1];
        p_3.innerHTML = response["about-me-text"][lang_num][2];
        cv_button.innerHTML = response["cv-button"][lang_num];
    } else if (document.location.href.includes("mywork")) subtitle.innerHTML = response["my-work"][lang_num].toUpperCase();
    else subtitle.innerHTML = response["contact-me"][lang_num].toUpperCase();
})