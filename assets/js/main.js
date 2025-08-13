// FUNKCIJE ZA ONESPOSOBLJAVANJE SKROLA PRILIKOM POJAVE LOADERA/MODALA //

function disableScroll() {
    document.body.style.overflow = "hidden";
}

function enableScroll() {
    document.body.style.overflow = "auto";
}

disableScroll();

// LOADER I UČITAVANJE MODALA //

const loader = document.getElementById("loader");
let doneLoading = false;

window.addEventListener("load", () => {
    setTimeout(() => { 
        loader.classList.add("loader-done");
        doneLoading = true;
    }, 3000);
});

window.addEventListener("transitionend", (e) => {
    if (e.target === loader && e.propertyName === "opacity" && doneLoading) {
        document.body.removeChild(loader);
        enableScroll();
        setTimeout(() => {
            modalBg.classList.remove("d-none");
            modalBg.classList.add("d-flex");
            disableScroll();
        }, 5000);
    }
});

// BACK TO TOP DUGME ANIMACIJA NA KLIK I NA SKROLOVANJE SA JQUERY//

$("#back-to-top").click(function(){
    $("html").animate({scrollTop: 0}, "fast");
});

$(window).scroll(function () {
    if ($(this).scrollTop() > window.innerHeight) {
        $("#back-to-top").fadeIn("slow");
    } else {
        $("#back-to-top").fadeOut("slow");
    }
});

// HEADER PROMENI BOJU PRILIKOM SKROLOVANJA //

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    if (window.scrollY > window.innerHeight - headerHeight) {
        header.classList.add("blue-header");
    } else {     
        header.classList.remove("blue-header");
    }
});

// POČETAK KODA ZA PROVERU VALIDNOSTI PODATAKA NA FORMI //

// ISPIS GREŠKE //

function inputError(type, input, small){
    if (type === "input" || type === "select") {
        input.classList.remove("border-success", "border-secondary", "border-light");
        input.classList.add("border-danger");
    }
    small.classList.remove("invisible");
    small.classList.add("visible"); 
}

// ISPIS USPEHA //

function inputSuccess(required, type, input, small){ 
    if (type === "input" || type === "select") {  
        input.classList.remove("border-danger", "border-light", "border-secondary");
        if(!required){
            dayNightInputModifier(input);    
        } else input.classList.add("border-success");
    }
    small.classList.remove("visible");
    small.classList.add("invisible");
}

// ODREĐUJE BOJU IVICE U ZAVISNOSTI KOJI JE REŽIM (SVETLI/TAMNI) NAMEŠTEN //

function dayNightInputModifier(input){ 
    input.classList.remove("border-danger", "border-success");
    switch(togglerFlag) {
        case "day": input.classList.add("border-secondary"); break;
        case "night": input.classList.add("border-light"); break;
    }
}


// INICIJALIZACIJA ELEMENATA FORME //

function initializeInputs(inputs) {
    inputs.forEach((input) => {
        input.touched = false;
        input.validate = () => inputCheck(input);
    });
}

// PROVERA VALIDNOSTI PODATAKA U FORMI //

function inputCheck(input) {
    switch(input.type) {
        case "input":
            if (!input.regEx.test(input.element.value) && input.element.value.trim() !== "") {
                inputError(input.type, input.element, input.small);
                input.small.innerHTML = input.errMssg;
                return false;
            } else if (input.element.value.trim() === "") {
                if (input.required) {
                    inputError(input.type, input.element, input.small);
                    input.small.innerHTML = input.blankMssg;
                    return false;
                } else {
                    inputSuccess(input.required, input.type, input.element, input.small);
                    return true;
                }
            } else {
                inputSuccess(input.required, input.type, input.element, input.small);
                return true;
            }

        case "select":
            if (input.required && input.element.value === "0") {
                inputError(input.type, input.element, input.small);
                input.small.innerHTML = input.blankMssg;
                return false;
            } else {
                inputSuccess(input.required, input.type, input.element, input.small);
                return true;
            }

        case "radio":
            if (input.required) {
                const uncheckedRadios = Array.from(input.element).filter(radio => !radio.checked);
                if (uncheckedRadios.length === input.element.length) return false;
                else return true;
            } else return true;

        case "checkbox":
            if (input.required && !input.element.checked) {
                inputError(input.type, input.element, input.small);
                input.small.innerHTML = input.blankMssg;
                return false;
            } else {
                inputSuccess(input.required, input.type, input.element, input.small);
                return true;
            }
    }
}

// DOGAĐAJI TOKOM POPUNJAVANJA ELEMENATA FORME //

function formEvents(inputs, submit, small) {
    inputs.forEach((input) => {
        const inputTouched = () => {
            input.touched = true;
            input.validate();
            submitEnabler(inputs, submit, small);
        };

        switch(input.type) {
            case "input":
                input.element.addEventListener("blur", inputTouched);
                input.element.addEventListener("keyup", inputTouched);
                break;

            case "checkbox":
            case "select":
                input.element.addEventListener("change", inputTouched);
                break;

            case "radio":
                Array.from(input.element).forEach((radio) => {
                    radio.addEventListener("change", inputTouched);
                });
                break;
        }
    });
}

// OSPOSOBLJAVA SUBMIT DUGME AKO JE SVE LEPO POPUNJENO //

function submitEnabler(inputs, submit, small) {
    let allValid = true;
    let allTouched = true;

    inputs.forEach((input) => {
        if (!input.touched && input.required) {
            allTouched = false;
        }
        if (input.touched) {
            const isVallid = input.validate();
            allValid = allValid && isVallid;
        }
    });
    if (allValid && allTouched) {
        submit.disabled = false;
        submit.classList.remove("disabled");
        submit.classList.add("enabled");
        small.classList.remove("visible");
        small.classList.add("invisible");
    } else {
        submit.disabled = true;
        submit.classList.remove("enabled");
        submit.classList.add("disabled");
        small.classList.remove("visible");
        small.classList.add("invisible");
    }
}

// DOGAĐAJ NA SUBMIT FORME //

function submited(form, smallForm, inputs, smalls, submit) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        resetForm(form, inputs, smalls, smallForm, submit);
        form.reset();
        smallForm.classList.remove("invisible");
        smallForm.classList.add("visible");
    }); 
}

// DOGAĐAJ NA RESET FORME //

function resetForm(form, inputs, smalls, smallForm, submit) {
    form.addEventListener("reset", () => {
        inputs.forEach((input) => {
            input.touched = false;
            if (input.type === "select" || input.type === "input") {
                dayNightInputModifier(input.element);
            }
        });
        Array.from(smalls).forEach((small) => {
            small.classList.remove("visible");
            small.classList.add("invisible");
        });
        error = false;
        touchedFlag = false;
        submitEnabler(inputs, submit, smallForm)
    });
}

// KRAJ KODA ZA PROVERU VALIDNOSTI PODATAKA NA FORMI //

// FUNKCIJA ZA DINAMIČKI ISPIS (OD SAD D.I.) ELEMENATA //

function dynamicCreating(data, targetElement, generateContent) {
    data.forEach((text, index) => {
        targetElement.innerHTML += generateContent(text, index);
    });
}

// POČETAK KODA SA FUNKCIONALNOSTIMA MODALA //

const modalBg = document.getElementById("modal-bg");
const modalForm = document.querySelector("#modal form");
const modalInputSmall = document.getElementById("modal-input-small");
const modalFormSmall = document.getElementById("modal-form-small");
const modalSubmit = document.getElementById("modal-submit"); 
const closeModalElements = document.getElementsByClassName("close-modal");      
const emailRegEx = /^([a-z]|[0-9]|[\.\-\_]){3,30}@([a-z]|[\.]){5,15}$/;
const emailErrMssg = "Email must contain @ and .";
const emailBlankMssg = "Email field is required.";

// OBRADA FORME U MODALU //

const modalInputs = [
    {
        required: true,
        type: "input",
        regEx: emailRegEx,
        element: document.getElementById("modal-email"),
        small: modalInputSmall,
        errMssg: emailErrMssg,
        blankMssg: emailBlankMssg
    }
];

initializeInputs(modalInputs);  
formEvents(modalInputs, modalSubmit, modalFormSmall);
submitEnabler(modalInputs, modalSubmit, modalFormSmall); 
submited(modalForm, modalFormSmall, modalInputs, modalInputSmall, modalSubmit);

// MODAL SE ZATVARA 3 SEKUNDE NAKON SUBMITA //

modalForm.addEventListener("submit", (e) => { 
    e.preventDefault();
    modalFormSmall.classList.remove("invisible");
    modalFormSmall.classList.add("visible");
    setTimeout(closeModal, 3000);
});

// MODAL SE ZATVARA KLIKOM NA CANCEL DUGME (X) //

function closeModal() {
    modalBg.classList.remove("d-flex");
    modalBg.classList.add("d-none");
    enableScroll();
}

Array.from(closeModalElements).forEach((element) => { 
    element.addEventListener("click", closeModal);  
});

// KRAJ KODA SA FUNKCIONALNOSTIMA MODALA

// DINAMIČKO DODAVANJE KLASAMA H2 I H3 ELEMENTIMA SA JQUERY //

$(document).ready(function() {
    $("h2").not("#modal h2, .footer-content-block h2").addClass("fade-in");
    $("h2").not("#newsletter-title h2").addClass("text-center");
    $("h2").not(".footer-content-block h2").addClass("text-dark fs-1");
    $(".footer-content-block h2").addClass("fs-5");
    $("h3").addClass("fs-5");
});

// ELEMENTI SE PRIKAZUJU NA SKROL SA ANIMACIJOM //

window.addEventListener("scroll", function () {
    const pageBottom = window.scrollY + window.innerHeight;
    const fadeInElements = document.getElementsByClassName("fade-in");
    
    Array.from(fadeInElements).forEach((element) => {
        const divTop = element.offsetTop + element.offsetHeight;
        const divHeight = element.offsetHeight;
        if (pageBottom > divTop - divHeight) {
            element.classList.add("fade-in-after");
        }
    });
});

// D.I. LINKOVI U NAV //

const navLinks = [
    {
        path: "",
        name: "Home",
        class: "orange"
    },
    {
        path: "#about",
        name: "About",
        class: "strict-white"
    },
    {
        path: "#services",
        name: "Services",
        class: "strict-white"
    },
    {
        path: "#portfolio",
        name: "Portfolio",
        class: "strict-white"
    },
    {
        path: "#contact",
        name: "Contact",
        class: "strict-white"
    },
    {
        path: "#testimonials",
        name: "Testimonials",
        class: "strict-white"
    },
];

dynamicCreating(navLinks, document.getElementById("nav-links"),
    (text) => `<li class="nav-item float-lg-start">
                    <a class="${text.class} fw-medium text-uppercase nav-link" href="index.html${text.path}">${text.name}</a>
               </li>`
);

// D.I. DUGMAD U NAV //

const navIcons = [
    {
        id: "toggler",
        class: "rounded d-flex align-items-center toggler-night",
        icon: "moon"
    },
    {
        id: "hamburger",
        class: "border border-0 strict-white",
        icon: "bars"
    }
];

dynamicCreating(navIcons, document.getElementById("nav-buttons"),
    (text) => `<button type="button" id="${text.id}" class="${text.class} mx-1 px-2">
                    <i class="fa-solid fa-${text.icon}"></i>
                </button>`
);

// TOGLER NA KLIK MOŽE DA MENJA STRANICU U DARK ILI LIGHT MODE //

const toggler = document.getElementById("toggler");
let togglerFlag = "day";

function dayNightSwap(className, remove, add){
    Array.from(className).forEach((element) => {
        element.classList.remove(`${remove}`);
        element.classList.add(`${add}`);
    });
}

function togglerSwap(icon, remove, add){
    toggler.innerHTML = `${icon}`;
    toggler.classList.remove(`${remove}`);
    toggler.classList.add(`${add}`);
}

toggler.addEventListener("click", () => {
    if (togglerFlag === "day") {
        togglerSwap(`<i class="fa-solid fa-sun"></i>`, "toggler-night", "toggler-day");
        dayNightSwap(document.getElementsByClassName("text-dark"), "text-dark", "text-light");
        dayNightSwap(document.getElementsByClassName("bg-light"), "bg-light", "bg-dark");
        dayNightSwap(document.getElementsByClassName("bg-dark-subtle"), "bg-dark-subtle", "bg-black");
        dayNightSwap(document.getElementsByClassName("border-secondary"), "border-secondary", "border-light");
        togglerFlag = "night";
    } else if (togglerFlag === "night") {
        togglerSwap(`<i class="fa-solid fa-moon"></i>`, "toggler-day", "toggler-night");
        dayNightSwap(document.getElementsByClassName("text-light"), "text-light", "text-dark");
        dayNightSwap(document.getElementsByClassName("bg-dark"), "bg-dark", "bg-light");
        dayNightSwap(document.getElementsByClassName("bg-black"), "bg-black", "bg-dark-subtle");
        dayNightSwap(document.getElementsByClassName("border-light"), "border-light", "border-secondary");
        togglerFlag = "day";
    }
});

// HAMBURGER U MANJIM REZOLUCIJAMA KLIKOM POKAZUJE MENI SA JQUERY //

$("#hamburger").click(function(){
    if ($("nav ul").is(":visible")) {
        $("#hamburger").html(`<i class="fa-solid fa-bars"></i>`);
    } else {
        $("#hamburger").html(`<i class="fa-solid fa-x"></i>`);
    }
    $("nav ul").slideToggle("slow");
});

// POČETAK KODA KOJI NE TREBA DA SE IZVRŠI U AUTHOR.HTML //

const url = window.location.href;

if(url.indexOf("author.html") === -1){

    // D.I. SLAJDOVA U CAROUSELU U POČETNOJ SEKCIJI SA ID BACKGROUND //

    const bgs = [
        {
            title: "We build things architext dream up",
            linkName: "about us",
            link: "about",
        },
        {
            title: "See projects we've done before",
            linkName: "our portfolio",
            link: "portfolio",
        },
        {
            title: "We are doing all kinds of welding services",
            linkName: "contact us",
            link: "contact",
        }
    ];

    dynamicCreating(bgs, document.getElementById("background"),
    (text) => `<div class="bg-slider justify-content-center align-items-center h-100 w-100 mx-auto">
                    <div class="w-75">
                        <h1 class="strict-white w-100 text-center mx-auto">${text.title}</h1>
                        <div class="w-100">
                            <a href="index.html#${text.link}" class="strict-white rounded d-flex justify-content-center align-items-center mx-auto mt-5 text-uppercase fw-medium shadow">${text.linkName}</a>
                        </div>
                    </div>
                </div>`
    );

    Array.from(document.getElementsByClassName("bg-slider")).forEach((slider, index) => {
        slider.style.backgroundImage = `url("./assets/img/bg-${bgs[index].link}.jpg")`;
    });

    // D.I. STRELICE U POMENUTOJ SEKCIJI //

    const arrowsData = [
        {
            icon: "less",
            id: "previous"
        },
        {
            icon: "greater",
            id: "next"
        }
    ];

    dynamicCreating(arrowsData, document.getElementById("background"),
    (text) => `<button type="button" id="${text.id}" class="strict-white border border-0 position-absolute d-flex arrow justify-content-center align-items-center">
                    <i class="fa-solid fa-${text.icon}-than"></i>
                </button>`
    );

    // D.I. DUGMAD U POMENUTOJ SEKCIJI //

    const threeElementsArray = Array.from({ length: 3 });

    dynamicCreating(threeElementsArray, document.getElementById("dots"),
        (_, index) => `<div id="dot${index + 1}" class="dot rounded-circle"></div>`
    );
    
    // POČETAK FUNCKIONALNOSTI CAROUSELA U POMENUTOJ SEKCIJI //
    
    let bgIndex = 1;
    const bgSlides = document.getElementsByClassName("bg-slider");
    const dotButtons = document.getElementsByClassName("dot");
    let bgChange;

    // PRIKAZ SLAJDOVA //

    function showBgSlide(index) {
        Array.from(bgSlides).forEach((slide) => (slide.style.display = "none"));
        Array.from(dotButtons).forEach((dot) => dot.classList.remove("dot-active"));
        bgSlides[index - 1].style.display = "flex";
        dotButtons[index - 1].classList.add("dot-active");
    }

    // F-JA ZA POMERANJA SLAJDA NAPRED ILI NAZAD //

    function changeBg(direction) {
        bgIndex += direction;
        if (bgIndex > bgSlides.length) bgIndex = 1;
        if (bgIndex < 1) bgIndex = bgSlides.length;
        showBgSlide(bgIndex);
        resetBgTimer();
    }

    // F-JA ZA RESETOVANJE TAJMERA

    function resetBgTimer() {
        clearInterval(bgChange);
        bgChange = setInterval(() => changeBg(1), 5000);
    }

    // POZIVANJE F-JE ZA PRIKAZ SLAJDA I POKRETANJE TAJMERA ZA MENJANJE SLAJDA //

    showBgSlide(bgIndex);
    bgChange = setInterval(() => changeBg(1), 5000);

    // DOGAĐAJI NA KLIK STRELICA I DUGMADI //

    document.getElementById("previous").addEventListener("click", () => changeBg(-1));
    document.getElementById("next").addEventListener("click", () => changeBg(1));
    Array.from(dotButtons).forEach((dot, index) =>
        dot.addEventListener("click", () => {
            bgIndex = index + 1;
            showBgSlide(bgIndex);
            resetBgTimer();
        })
    );

    // KRAJ F-JA ZA UREĐIVANJE CAROUSELA //

    // D.I. SADRŽAJA U ABOUT SEKCIJI //

    const aboutParts = [
        {
            id: "about-txt",
            class: ""
        },
        {
            id: "about-img",    
            class: "d-flex flex-column justify-content-center"    
        }
    ];

    dynamicCreating(aboutParts, document.getElementById("about-parts-container"),
    (text) => `<div id="${text.id}" class="fade-in col-lg-6 col-12 ${text.class}"></div>`   
    );

    const aboutPages = ["Welcome to WeldPro, where precision welding meets craftsmanship and excellence. Our highly skilled team is dedicated to delivering superior results, whether it's enhancing the security of your property with gate welding, improving energy efficiency with window welding, or customizing your motorcycle with bike welding. With a commitment to innovation and personalized service, we ensure that every project is executed with the utmost care and attention to detail. From initial consultation to project completion, you can trust WeldPro to exceed your expectations and deliver exceptional quality and reliability. Join us on the journey of precision welding excellence and experience the difference with WeldPro.", 
        "WeldPro began as a small workshop driven by a passion for welding and an unwavering commitment to quality craftsmanship. From its humble beginnings, the company focused on delivering reliable and precise welding solutions, quickly earning a reputation for excellence. Over the years, WeldPro grew steadily, expanding its range of services to meet the needs of homeowners, businesses, and industries alike. By embracing advanced technologies and innovative techniques, the company was able to refine its processes and deliver results that exceeded expectations. What started as a one-person operation has evolved into a trusted name in welding, with a team of skilled professionals dedicated to bringing durability, creativity, and precision to every project. Today, WeldPro remains true to its roots—providing exceptional service while continuing to push the boundaries of what’s possible in the world of welding."];

    dynamicCreating(aboutPages, document.getElementById("about-txt"),
    (text) => `<p class="mt-5 text-dark">${text}</p>`
    );

    dynamicCreating(Array.from({ length: 2 }), document.getElementById("about-img"),
    (_, index) => `<img class="mt-5 w-75 mx-auto rounded border border-secondary" src="./assets/img/about${index + 1}.jpg" alt="WeldPro doing welding project ${index + 1}"/>`
    );

    // D.I. PITANJA I ODGOVORA U POMENUTOJ SEKCIJI //   

    const qandas = [
        { 
            question: "What types of welding services does WeldPro offer?",
            answer: "Troweld provides a comprehensive range of welding services including home welding, gate welding, window welding, machine welding, bike welding, and car welding."
        },
        { 
            question: "How does Troweld ensure the quality and reliability of its welding work?",
            answer: "At Troweld, we ensure quality and reliability by employing highly skilled welders, investing in state-of-the-art equipment and techniques, and adhering to strict quality control measures throughout every project."
        },
        { 
            question: "Can Troweld handle both small-scale repairs and large-scale fabrication projects?",
            answer: "Yes, Troweld is equipped to handle projects of all sizes, from minor repairs to major fabrication projects. Our skilled team has the expertise and capabilities to meet the diverse needs of our clients."
        },
        { 
            question: "How can I get started with Troweld for my welding project?",
            answer: "Getting started with Troweld is easy! Simply contact us through our website or give us a call to discuss your project needs and schedule a consultation. We'll work with you every step of the way to bring your welding project to life with precision and excellence."
        },
    ];

    dynamicCreating(qandas, document.getElementById("qandas"),
        (text) => `<li class="list-group item">
                        <h3 class="bg-dark-subtle text-dark w-100 m-0 border border-secondary p-2"><i class="fa-solid fa-caret-right orange"></i> ${text.question}</h3>
                        <p class="bg-light text-dark w-100 m-0 border border-secondary">${text.answer}</p>
                    </li>` 
    );

    // TEKST SE PRIKAZUJE/SKLANJA KLIKOM NA PITANJE U POMENUTOJ SEKCIJI SA JQUERY //  
    
    $("#qandas").on("click", "li", function() {
        const answer = $(this).find("p").first();   
        answer.slideToggle("slow");
        answer.toggleClass("show")
        $(this).find(".fa-caret-right").toggleClass("rotate-icon");
    });

    // D.I. SADRŽAJA U SERVICES SEKCIJI //

    const services = [
        {
            icon: "home",
            title: "Home",
            text: "Elevate your living space with our precise home welding services, blending functionality and aesthetics seamlessly."
        },
        {
            icon: "gate",
            title: "Gate",
            text: "Secure your property with style through our gate welding services, creating elegant and robust entrances."
        },
        {
            icon: "window",
            title: "Window",
            text: "Enhance your home's energy efficiency and beauty with our window welding services, crafted for durability and design."
        },
        {
            icon: "machine",
            title: "Machine",
            text: "Optimize machinery performance with our machine welding services, offering comprehensive solutions for various equipment."
        },
        {
            icon: "bike",
            title: "Bike",
            text: "Personalize your ride with our bike welding services, providing custom modifications for a unique and stylish motorcycle."
        },
        {
            icon: "car",
            title: "Car",
            text: "Revitalize your vehicle with our car welding services, combining precision repairs and enhancements for optimal performance and aesthetics."
        },
    ];

    dynamicCreating(services, document.getElementById("service-blocks"),
    (text) => `<div class="mx-auto mt-1 p-3 col-lg-4 col-md-6 col-sm-10 col-xs-12">
                    <div class="rounded border border-secondary p-3 d-flex flex-column justify-content-center align-items-center bg-dark-subtle">
                        <img class="mt-3" src="./assets/img/${text.icon}-welding.png" alt="${text.title} icon"/>
                        <h3 class="mt-3 text-dark">${text.title} welding</h3>
                        <p class="mt-3 text-dark">${text.text}</p>
                        <button class="strict-white rounded mt-3 fw-medium px-3 py-1" type="button">Show more</button>
                    </div>
                </div>`
    );

    // TEKST SE PRIKAZUJE/SKLANJA KLIKOM NA DUGME U POMENUTOJ SEKCIJI SA JQUERY //

    $("#services button").click(function() {
        if ($(this).html() === "Show more") {
            $(this).html("Show less");
        } else {
            $(this).html("Show more");
        }
        $(this).parent().find("p").slideToggle("slow");
    });

    // D.I. DUGMADI I SLIKA U PORTFOLIO SEKCIJI //

    const portParts = [
        {
            id: "portfolio-buttons",
            class: "w-100 d-flex justify-content-center my-3 flex-wrap"
        },
        {
            id: "portfolio-images",
            class: "row"  
        }
    ];

    dynamicCreating(portParts, document.getElementById("portfolio"),
        (text) => `<div id="${text.id}" class="fade-in ${text.class}"></div>`
    );
    
    const portButtons = ["decorative", "facades", "perforated", "railings"];
    
    dynamicCreating(portButtons, document.getElementById("portfolio-buttons"),
        (text) => `<button type="button" class="strict-white rounded border border-0 mx-3 mt-3 fw-medium port-button text-uppercase p-2">${text}</button>`
    );
    
    dynamicCreating(threeElementsArray, document.getElementById("portfolio-images"),
        (_, index) => `<figure class="col-lg-4 col-sm-8 col-xs-12 mx-auto my-3">
                            <img class="w-100 border border-secondary rounded" src="./assets/img/decorative${index + 1}.jpg" alt="decorative welding project ${index + 1}"/>
                            <figcaption class="mt-1 text-center text-dark">decorative welding project ${index + 1}</figcaption>
                        </figure>`
    );
    
    const portButtonElements = document.getElementsByClassName("port-button");
    portButtonElements[0].classList.add("port-active");

    // KLIKOM NA DUGME PRIKAZUJU SE SLIKE ODGOVARAJUĆE VRSTE U POMENUTOJ SEKCIJI SA JQUERY //

    $(".port-button").click(function () {
        $(".port-active").removeClass("port-active");
        $(this).addClass("port-active");

        let clickedPortText = $(this).text().trim();

        $("#portfolio-images img").each(function (i) {
            $(this).attr({"src": `./assets/img/${clickedPortText}${i + 1}.jpg`, "alt": `${clickedPortText} welding project ${i + 1}`});
            $(this).next("figcaption").text(`${clickedPortText} welding project ${i + 1}`);
        });
    });

    // D.I. OPCIJA U SELECT DROP DOWNU U FORMI CONTACT SEKCIJE //
    
    const options = ["Select Service", "Home Welding", "Gate Welding", "Window Welding", "Machine Welding", "Bike Welding", "Car Welding"];

    dynamicCreating(options, document.getElementById("select"),
    (text, index) => `<option value="${index}">${text}</option>`
    );

    // D.I. 
    //  BUTONA U POMENUTOJ FORMI //

    const gens = ["Male", "Female", "Other"];

    dynamicCreating(gens, document.getElementById("gens"),
    (text) => `<div class="col-md-4 col-12">
                    <input type="radio" class="contact-radio" name="radiob" id="radio${text}" value="radio${text}"/>
                    <label class="text-dark me-1" for="radio${text}">${text}</label>
                </div>`
    );

    // D.I. CHECKBOXOVA U POMENUTOJ FORMI //

    const checks = [
        {
            name: "subscribe",
            text: "Subscribe to the Newsletter"
        },
        {
            name: "tas",
            text: `I agree with Terms and Services <span class="text-danger">*</span>`
        }
    ];
    
    dynamicCreating(checks, document.getElementById("checks"),
    (text) => `<li class="list-group-item bg-dark-subtle border border-0">
                    <input class="form-check-input" type="checkbox" name="${text.name}-check" id="${text.name}-check" value="${text.name}-check"/>
                    <label class="text-dark form-check-label" for="${text.name}-check">${text.text}</label>
                </li>`
    );

    // D.I. DUGMADI U POMENUTOJ FORMI //

    const formButtons = [
        {
            type: "submit",
            value: "SUBMIT",
            disabled: "disabled",
            class: "disabled"
        },
        {
            type: "reset",
            value: "RESET",
            disabled: "",
            class: "enabled"
        }
    ];

    dynamicCreating(formButtons, document.getElementById("form-buttons"),
    (text) => `<input type="${text.type}" ${text.disabled} id="contact-${text.type}" name="contact-${text.type}" value="${text.value}" class="${text.class} strict-white rounded py-1 px-2 my-3 mx-2"/>`
    );

    // VALIDACIJA POMENUTE FORME //

    const contactForm = document.getElementById("contact-form");
    const contactSubmit = document.getElementById("contact-submit");
    const contactFormSmall = document.getElementById("small-contact-form");
    const contactSmalls = document.querySelectorAll("#contact-form small");

    const contactInputs = [
        { 
            required: true,
            type: "input",
            regEx: /^[A-Z][a-z]{2,12}(\s[A-Z][a-z]{2,12}){1,3}$/,
            element: document.getElementById("name"),
            small: document.getElementById("small-name"),
            errMssg: "Name must start with a capital letter and contain 2-12 characters.",
            blankMssg: "Name field is required."
        },
        { 
            required: true,
            type: "input",
            regEx: emailRegEx,
            element: document.getElementById("email"),
            small: document.getElementById("small-email"),
            errMssg: "Email must contain @ and .",
            blankMssg: "Email field is required."
        },
        { 
            required: false,
            type: "input",
            regEx: /^\+[1-9](?:\d[-\s]?){9,13}\d$/,
            element: document.getElementById("phone"),
            small: document.getElementById("small-phone"),
            errMssg: "Phone must start with + and contain 11-15 digits.",
            blankMssg: ""
        },
        { 
            required: true,
            type: "input",
            regEx: /^.{10,1000}$/,
            element: document.getElementById("mssg"),
            small: document.getElementById("small-mssg"),
            errMssg: "Message must contain 10-1000 characters.",
            blankMssg: "Message field is required."
        },
        { 
            required: true,
            type: "select",
            regEx: "",
            element: document.getElementById("select"),
            small: document.getElementById("small-select"),
            errMssg: "",
            blankMssg: "Please select a service."
        },
        { 
            required: true,
            type: "radio",
            regEx: "",
            element: document.getElementsByClassName("contact-radio"),
            small: document.getElementById("small-gen"),
            errMssg: "",
            blankMssg: ""
        },
        { 
            required: true,
            type: "checkbox",
            regEx: "",
            element: document.getElementById("tas-check"),
            small: document.getElementById("small-check"),
            errMssg: "",
            blankMssg: "Please accept terms and services."
        },
        { 
            required: false,
            type: "checkbox",
            regEx: "",
            element: document.getElementById("subscribe-check"),
            small: null,
            errMssg: "",
            blankMssg: ""
        }
    ];

    initializeInputs(contactInputs);
    formEvents(contactInputs, contactSubmit, contactFormSmall);
    submitEnabler(contactInputs, contactSubmit, contactFormSmall); 
    submited(contactForm, contactFormSmall, contactInputs, contactSmalls, contactSubmit);

    // D.I. SLAJDOVA U TESTIMONIALS SEKCIJI //

    const testimonials = [
        {
            name: "John Anderson",
            text: "Impressed with the meticulous work of WeldPro in reinforcing our home's structure; their home welding service truly transformed our living space.",
        },
        {
            name: "Angela Carter",
            text: "The gate welding service from WeldPro not only secured our property but also added an elegant touch; exceptional craftsmanship and reliability."
        },
        {
            name: "Kenji Nakamura",
            text: "Highly recommend WeldPro for window welding; they struck the perfect balance between durability and design, enhancing both efficiency and aesthetics."
        },
        {
            name: "Priya Sharma",
            text: "Exceptional machine welding services from WeldPro; their team's expertise and precision in repairing and modifying machinery exceeded our expectations."
        },
        {
            name: "Dakota Redhawk",
            text: "Thrilled with the personalized touch WeldPro brought to my bike; their bike welding service turned my motorcycle into a true reflection of my style."
        },
        {
            name: "Layla Khalid",
            text: "Outstanding car welding services by WeldPro; their attention to detail and commitment to quality transformed my vehicle into a performance and style masterpiece."
        }
    ];

    dynamicCreating(testimonials, document.getElementById("testimonials-slider"),
    (text, index) => `<div class="card border border-secondary bg-dark-subtle">
                        <img src="./assets/img/person${index + 1}.jpg" class="card-img-top border-bottom border-secondary" alt="Slide ${index + 1} image">
                        <div class="card-body">
                            <h3 class="card-title orange">${text.name}</h3>
                            <p class="card-text text-dark">${text.text}</p>
                        </div>
                    </div>`
    );   

    // JQUERY PLUGIN SLICK SLIDER U POMENUTOJ SEKCIJI //

    $("#testimonials-slider").slick({
        dots: true,
        arrows: true,
        slidesToShow: 5,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // D.I. DUGMADI U NEWSLETTER SEKCIJI //

    dynamicCreating(formButtons, document.getElementById("newsletter-buttons"),
    (text) => `<input type="${text.type}" ${text.disabled} id="newsletter-${text.type}" name="newsletter-${text.type}" value="${text.value}" class="${text.class} strict-white rounded px-2 py-1 my-3 mx-2"/>`
    );

    // OBRADA FORME U NEWSLETTER SEKCIJI // 

    const newsletterForm = document.getElementById("newsletter-form");
    const newsletterSubmit = document.getElementById("newsletter-submit");
    const newsletterFormSmall = document.getElementById("newsletter-form-small");
    const newsletterSmalls = document.querySelectorAll("#newsletter-form small");

    const newsletterInputs = [
        {
            required: true,
            type: "input",
            regEx: emailRegEx,
            element: document.getElementById("newsletter-email"),
            small: document.getElementById("newsletter-email-small"),
            errMssg: "Email must contain @ and .",
            blankMssg: "Email field is required."
        }
    ];

    initializeInputs(newsletterInputs);
    formEvents(newsletterInputs, newsletterSubmit, newsletterFormSmall);
    submitEnabler(newsletterInputs, newsletterSubmit, newsletterFormSmall); 
    submited(newsletterForm, newsletterFormSmall, newsletterInputs, newsletterSmalls, newsletterSubmit);
    resetForm(newsletterForm, newsletterInputs, newsletterSmalls, newsletterFormSmall, newsletterSubmit); 
}

// KRAJ KODA KOJI NE TREBA DA SE IZVRŠI U AUTHOR.HTML //

// POČETAK D.I. FOOTERA //

// ISPIS REDOVA U FOOTERU //

const footerRows = ["footer-content", "footer-end"];

dynamicCreating(footerRows, document.querySelector("footer"),
    (text) => `<div id="${text}" class="row pb-2"></div>`
);

// ISPIS BLOKOVA U PRVOM REDU FOOTERA //

const footerContentBlocks = [
    {
        id: "navigation",
        title: "Navigation",    
    },
    {
        id: "services",
        title: "Services",    
    },
    {
        id: "contact",
        title: "Contact",    
    },
    {
        id: "useful-links",
        title: "Useful links",    
    }
];

dynamicCreating(footerContentBlocks, document.getElementById("footer-content"),
    (text) => `<div class="footer-content-block col-md-3 col-sm-6 col-12 d-flex flex-column align-items-center my-3">
                    <h2 class="orange">${text.title}</h2> 
                    <ul id="footer-${text.id}"></ul>   
                </div>`
);    

// ISPIS NAVIGACIJE U FOOTERU //

dynamicCreating(navLinks, document.getElementById("footer-navigation"),
    (text) => `<li class="nav-item"><a href="index.html${text.path}" class="nav-link my-2">${text.name}</a></li>`
);

// ISPIS SERVISA U FOOTERU //

const footerServices = ["Home", "Gate", "Window", "Machine", "Bike", "Car"]

dynamicCreating(footerServices, document.getElementById("footer-services"),
    (text) => `<li class="my-2">${text} welding</li>`
); 

// ISPIS KONTAKT PODATAKA U FOOTERU //

const footerContact = [
    {
        icon: "location-dot",
        text: "12 Welding Street, New York"
    },
    {
        icon: "envelope",
        text: `<a class="strict-white" href="mailto:weldpro@gmail.com">weldpro@gmail.com</a>`
    },
    {
        icon: "mobile",
        text: "+1 2345678901"
    }
];

dynamicCreating(footerContact, document.getElementById("footer-contact"),
    (text) => `<li class="my-2"><i class="fa-solid fa-${text.icon}"></i>&nbsp;&nbsp;${text.text}</li>`
); 

// ISPIS KORISNIH LINKOVA U FOOTERU //

const usefulLinks = [
    {
        path: "dokumentacija.pdf",
        name: "Documentation"
    },
    {
        path: "author.html",
        name: "Author"
    },
    {
        path: "sitemap.xml",
        name: "Sitemap"
    },
];

dynamicCreating(usefulLinks, document.getElementById("footer-useful-links"),
    (text) => `<li class="my-2"><a class="strict-white" href="${text.path}">${text.name}</a></li>`
); 

// ISPIS BLOKOVA U DRUGOM REDU FOOTERA //

const footerEndBlocks = [`<ul class="m-0 pt-5 d-flex justify-content-center" id="footer-socials"></ul>`, '<p id="copyright" class="strict-white pt-5 m-0"></p>'];

dynamicCreating(footerEndBlocks, document.getElementById("footer-end"),
    (text) => `<div class="col-sm-6 col-12 d-flex justify-content-center">
                    ${text}
                </div>`
); 

// ISPIS DANAŠNJE GODINE U ELEMENTU SA ID COPYRIGHT //

const date = new Date();
const year = date.getFullYear();
document.getElementById("copyright").innerHTML = `&copy; ${year} WeldPro. All right reserved.`;

// ISPIS IKONICA DRUŠTVENIH MREŽA U FOOTERU //

const socials = [
    {
        path: "https://www.facebook.com",
        icon: "fa-brands fa-facebook"
    },
    {
        path: "https://www.twitter.com",
        icon: "fa-brands fa-x"
    },
    {
        path: "https://www.instagram.com",
        icon: "fa-brands fa-instagram"
    },
    {
        path: "https://www.tiktok.com",
        icon: "fa-brands fa-tiktok"
    },
    {
        path: "https://www.youtube.com",
        icon: "fa-brands fa-youtube"
    }
];

dynamicCreating(socials, document.getElementById("footer-socials"),
    (text) => `<li><a class="strict-white mx-3" target="_blank" href="${text.path}"><i class="${text.icon}"></i></a></li>`
);

// KRAJ ISPISA //