// LOADER //

const loader = document.getElementById("loader");
let doneLoading = false;

window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("loader-done");
        doneLoading = true;
    }, 3000);
});

window.addEventListener("transitionend", (e) => {
    if (e.target == loader && e.propertyName == "opacity" && doneLoading) {
        document.body.removeChild(loader);
        setTimeout(() => {
            modalBg.classList.remove("d-none");
            modalBg.classList.add("d-flex");
        }, 5000);
    }
});

// BACK TO TOP DUGME ANIMACIJA NA KLIK I NA SKROLOVANJE//

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

// F-JA ZA PROVERU VALIDNOSTI PODATAKA NA FORMI //

function inputError(type, input, small){
    if (type == "input" || type == "select") {
        input.classList.remove("border-success", "border-secondary", "border-light");
        input.classList.add("border-danger");
    }
    small.classList.remove("invisible");
    small.classList.add("visible"); 
}

function inputSuccess(required, type, input, small){ 
    if (type == "input" || type == "select") {  
        input.classList.remove("border-danger", "border-light", "border-secondary");
        if(!required){
            dayNightInputModifier(input);    
        } else input.classList.add("border-success");
    }
    small.classList.remove("visible");
    small.classList.add("invisible");
}

function dayNightInputModifier(input){ 
    input.classList.remove("border-danger", "border-success");
    if(togglerFlag == "day") input.classList.add("border-secondary");
    else if(togglerFlag == "night") input.classList.add("border-light");
}

function inputCheck(required, type, regEx, input, small, errMssg, blankMssg) {
    if (type == "input") {
        if (!regEx.test(input.value) && input.value.trim() != "") {
            inputError(type, input, small);
            small.innerHTML = errMssg;
            return 1;
        } else if (input.value.trim() == "") {
            if (required) {
                inputError(type, input, small);
                small.innerHTML = blankMssg;
                return 1;
            } else {
                inputSuccess(required, type, input, small);
                return 0;
            }
        } else {
            inputSuccess(required, type, input, small);
            return 0;
        }
    } else if (type == "select") {
        if (input.value == 0) {
            inputError(type, input, small);
            small.innerHTML = blankMssg;
            return 1;
        } else {
            inputSuccess(required, type, input, small);
            return 0;
        }
    } else if (type == "radio") {
        let radioErr = 0;
        Array.from(input).forEach((radio) => {
            if (!radio.checked) {
                radioErr++;
            }
        });
        if (radioErr == input.length) {
            return 1;
        } else {
            inputSuccess(required, type, input, small);
            return 0;
        }
    } else if (type == "checkbox") {
        if (!input.checked) {
            inputError(type, input, small);
            small.innerHTML = blankMssg;
            return 1;
        } else {
            inputSuccess(required, type, input, small);
            return 0;
        }
    }
}

function formEvents(inputs, submit, small) {
    inputs.forEach((input) => {
        if (input.type == "input") {
            input.element.addEventListener("blur", () => {
                input.touched = true;
                if (input.touched) input.validate();
                submitEnabler(inputs, submit, small);
            });
            input.element.addEventListener("keyup", () => {
                input.touched = true;
                if (input.touched) input.validate();
                submitEnabler(inputs, submit, small);
            });
        } else if (input.type == "checkbox" || input.type == "select") {
            input.element.addEventListener("change", () => {
                input.touched = true;
                if (input.touched) input.validate();
                submitEnabler(inputs, submit, small);
            });
        } else if (input.type == "radio") {
            Array.from(input.element).forEach((radio) => {
                radio.addEventListener("change", () => {
                    input.touched = true;
                    if (input.touched) input.validate();
                    submitEnabler(inputs, submit, small);
                });
            });
        }
    });
}

function submitEnabler(inputs, submit, small) {
    let allValid = true;
    let allTouched = true;

    inputs.forEach((input) => {
        if (!input.touched && input.required) {
            allTouched = false;
            return;
        }
        if (input.touched) {
            const isValid = input.validate() == 0;
            allValid = allValid && isValid;
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

function submited(form, small) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        small.classList.remove("invisible");
        small.classList.add("visible");
    }); 
}

function resetForm(form, inputs, smalls, smallForm, submit) {
    form.addEventListener("reset", () => {
        inputs.forEach((input) => {
            input.touched = false;
            if (input.element && input.element.classList) {
                input.element.classList.remove("border-danger", "border-success", "border-light", "border-secondary");
                if (input.type !== "checkbox") {
                    dayNightInputModifier(input.element, togglerFlag);
                }
            } else if (input.type === "radio") {
                Array.from(input.element).forEach((radio) => {
                    if (radio.classList) {
                        radio.classList.remove("border-danger", "border-success");
                    }
                });
            }
        });
        Array.from(smalls).forEach((small) => {
            small.classList.remove("visible");
            small.classList.add("invisible");
        });
        smallForm.classList.remove("visible");
        smallForm.classList.add("invisible");
        error = false;
        touchedFlag = false;
        submitEnabler(inputs, submit, smallForm)
    });
}

// POČETAK KODA SA FUNKCIONALNOSTIMA MODALA //

const modalBg = document.getElementById("modal-bg");
const modalCancel = document.querySelector("#modal button");
const modalForm = document.querySelector("#modal form");
const modalInput = document.getElementById("modal-email");
const modalInputSmall = document.getElementById("modal-input-small");
const modalFormSmall = document.getElementById("modal-form-small");
const modalSubmit = document.getElementById("modal-submit");       
const emailRegEx = /^([a-z]|[0-9]|[\.\-\_]){3,30}@([a-z]|[\.]){5,15}$/;

// OBRADA FORME U MODALU //

const modalInputs = [ 
    {
        element: modalInput, 
        type: "input", 
        touched: false, 
        required: true,
        validate: () => inputCheck(true, "input", emailRegEx, modalInput, modalInputSmall, "Email must contain @ and .", "Email field is required."),
    }
];

formEvents(modalInputs, modalSubmit, modalFormSmall);
submitEnabler(modalInputs, modalSubmit, modalFormSmall); 
submited(modalForm, modalFormSmall);

modalForm.addEventListener("submit", (e) => { 
    e.preventDefault();
    modalFormSmall.classList.remove("invisible");
    modalFormSmall.classList.add("visible");
    setTimeout(closeModal, 3000);
});

function closeModal() {
    modalBg.classList.remove("d-flex");
    modalBg.classList.add("d-none");
}

// MODAL SE ZATVARA KLIKOM NA CANCEL DUGME (X) //

modalCancel.addEventListener("click", closeModal);

// KRAJ KODA SA FUNKCIONALNOSTIMA MODALA

// FUNKCIJA ZA DINAMIČKI ISPIS (OD SAD D.I.) ELEMENATA //

function dynamicCreating(data, targetElement, generateText) {
    data.forEach((text, index) => {
        targetElement.innerHTML += generateText(text, index);
    });
}

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
    if (togglerFlag == "day") {
        togglerSwap(`<i class="fa-solid fa-sun"></i>`, "toggler-night", "toggler-day");
        dayNightSwap(document.getElementsByClassName("text-dark"), "text-dark", "text-light");
        dayNightSwap(document.getElementsByClassName("bg-light"), "bg-light", "bg-dark");
        dayNightSwap(document.getElementsByClassName("bg-dark-subtle"), "bg-dark-subtle", "bg-black");
        dayNightSwap(document.getElementsByClassName("border-secondary"), "border-secondary", "border-light");
        togglerFlag = "night";
    } else if (togglerFlag == "night") {
        togglerSwap(`<i class="fa-solid fa-moon"></i>`, "toggler-day", "toggler-night");
        dayNightSwap(document.getElementsByClassName("text-light"), "text-light", "text-dark");
        dayNightSwap(document.getElementsByClassName("bg-dark"), "bg-dark", "bg-light");
        dayNightSwap(document.getElementsByClassName("bg-black"), "bg-black", "bg-dark-subtle");
        dayNightSwap(document.getElementsByClassName("border-light"), "border-light", "border-secondary");
        togglerFlag = "day";
    }
});

// HAMBURGER U MANJIM REZOLUCIJAMA KLIKOM POKAZUJE MENI //

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

if(url.indexOf("author.html") == -1){

    // ODGOVARAJUĆI ELEMENTI SE PRIKAZUJU NA SCROLL //

    $(window).scroll(function() {
        let pageBottom = $(window).scrollTop() + $(window).height();
        $(".fade-in").each(function() {
            let divTop = $(this).offset().top + $(this).outerHeight();
            let divHeight = $(this).height();
            if (pageBottom > divTop - divHeight) {
                $(this).addClass('fade-in-after');
            }
        });
    });

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

    // D.I. DUGMAD U POMENUTOJ SEKCIJI (BEZ F-JE NAPRAVLJENI) //

    let dotsWrite = "";

    for (let i = 0; i < 3; i++) {
        dotsWrite += `<div id="dot${i + 1}" class="dot rounded-circle"></div>`;
    }

    document.getElementById("dots").innerHTML += dotsWrite;  
    
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
    if(doneLoading) bgChange = setInterval(() => changeBg(1), 5000);

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

    dynamicCreating(aboutPages, document.getElementById("about-img"),
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
                        <h5 class="bg-dark-subtle text-dark w-100 m-0 border border-secondary p-2"><i class="fa-solid fa-caret-right orange"></i> ${text.question}</h5>
                        <p class="bg-light text-dark w-100 m-0 border border-secondary">${text.answer}</p>
                    </li>` 
    );

    // TEKST SE PRIKAZUJE/SKLANJA KLIKOM NA PITANJE U POMENUTOJ SEKCIJI //  
    
    $("#qandas").on("click", "li", function() {
        const answer = $(this).find("p").first();   
        answer.slideToggle("slow");
        answer.toggleClass("show")
        $(this).find(".fa-caret-right").toggleClass("rotate-icon");
    });

    // D.I. COUNTER BLOCKOVA U POMENUTOJ SEKCIJI //

    const counters = [  
        {
            text: "Projects done",
            number: "1200",
            icon: "check"
        },
        {
            text: "Happy clients",
            number: "3000",
            icon: "face-smile"
        },
        {
            text: "Our staff",
            number: "240",
            icon: "person"
        },
        {
            text: "Awards won",
            number: "15",
            icon: "award"
        }
    ];

    dynamicCreating(counters, document.getElementById("counters"),
        (text) => `<div class="col-md-3 col-sm-6 col-10 mx-auto d-flex flex-column border border-secondary bg-dark-subtle align-items-center">
                        <i class="my-2 fs-1 text-dark fa-solid fa-${text.icon}"></i>
                        <h2 class="number my-2 orange">0</h2>
                        <h5 class="my-2 text-dark">${text.text}</h5>
                    </div>` 
    );

    // JQUERY PLUGIN ISPIS BROJEVA U COUNTER BLOCKOVIMA //

    $(document).ready(function () {
        $(window).scroll(function() {
            if($("#counters").hasClass("fade-in-after")){
                for(let i = 0; i < counters.length; i++){   
                    $(".number").eq(i).counto(counters[i].number, 3000);
                }
            }
        });
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
                        <h5 class="mt-3 text-dark">${text.title} welding</h5>
                        <p class="mt-3 text-dark">${text.text}</p>
                        <button class="strict-white rounded mt-3 fw-medium px-3 py-1" type="button">Show more</button>
                    </div>
                </div>`
    );

    // TEKST SE PRIKAZUJE/SKLANJA KLIKOM NA DUGME U POMENUTOJ SEKCIJI //

    $("#services button").click(function() {
        if ($(this).html() == "Show more") {
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
    
    dynamicCreating(Array.from({ length: 3 }), document.getElementById("portfolio-images"),
        (_, index) => `<figure class="col-lg-4 col-sm-8 col-xs-12 mx-auto my-3">
                            <img class="w-100 border border-secondary rounded" src="./assets/img/decorative${index + 1}.jpg" alt="decorative welding project ${index + 1}"/>
                            <figcaption class="mt-1 text-center text-dark">decorative welding project ${index + 1}</figcaption>
                        </figure>`
    );
    
    const portButtonElements = document.getElementsByClassName("port-button");
    portButtonElements[0].classList.add("port-active");

    // KLIKOM NA DUGME PRIKAZUJU SE SLIKE ODGOVARAJUĆE VRSTE U POMENUTOJ SEKCIJI //

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

    // D.I. RADIO BUTONA U POMENUTOJ FORMI //

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
            text: "I agree with Terms and Services *"
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

    const contactName = document.getElementById("name");
    const contactNameSmall = document.getElementById("small-name");
    const nameRegEx = /^[A-Z][a-z]{2,12}(\s[A-Z][a-z]{2,12}){1,3}$/;
    const contactEmail = document.getElementById("email");
    const contactEmailSmall = document.getElementById("small-email");
    const contactPhone = document.getElementById("phone");
    const contactPhoneSmall = document.getElementById("small-phone");
    const phoneRegEx = /^\+[1-9](?:\d[-\s]?){9,13}\d$/;
    const contactTextArea = document.getElementById("mssg");
    const contactTextAreaSmall = document.getElementById("small-mssg");
    const mssgRegEx = /^.{10,1000}$/;
    const contactSelect = document.getElementById("select");
    const contactSelectSmall = document.getElementById("small-select"); 
    const contactRadio = document.getElementsByClassName("contact-radio");
    const contactRadioSmall = document.getElementById("small-gen"); 
    const contactCheckBox = document.getElementById("tas-check");  
    const contactCheckBoxSmall = document.getElementById("small-check");  
    const contactForm = document.getElementById("contact-form");
    const contactSubmit = document.getElementById("contact-submit");
    const contactFormSmall = document.getElementById("small-contact-form");
    const contactSmalls = document.getElementsByClassName("contact-small");

    const contactInputs = [
        { 
            element: contactName, 
            type: "input", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "input", nameRegEx, contactName, contactNameSmall, "Name must start with a capital letter and contain 2-12 characters.", "Name field is required.") 
        },
        { 
            element: contactEmail, 
            type: "input", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "input", emailRegEx, contactEmail, contactEmailSmall, "Email must contain @ and .", "Email field is required.") 
        },
        { 
            element: contactPhone, 
            type: "input", 
            touched: false, 
            required: false,
            validate: () => inputCheck(false, "input", phoneRegEx, contactPhone, contactPhoneSmall, "Phone must start with + and contain 11-15 digits.", "") 
        },
        { 
            element: contactTextArea, 
            type: "input", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "input", mssgRegEx, contactTextArea, contactTextAreaSmall, "Message must contain 10-1000 characters.", "Message field is required.") 
        },
        { 
            element: contactSelect, 
            type: "select", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "select", "", contactSelect, contactSelectSmall, "", "Please select a service.") 
        },
        { 
            element: contactRadio, 
            type: "radio", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "radio", "", contactRadio, contactRadioSmall, "", "") 
        },
        { 
            element: contactCheckBox, 
            type: "checkbox", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "checkbox", "", contactCheckBox, contactCheckBoxSmall, "", "Please accept terms and services.") 
        }
    ];    

    formEvents(contactInputs, contactSubmit, contactFormSmall);
    submitEnabler(contactInputs, contactSubmit, contactFormSmall); 
    submited(contactForm, contactFormSmall);
    resetForm(contactForm, contactInputs, contactSmalls, contactFormSmall, contactSubmit);  

    // JQUERY PLUGIN SLICK SLIDER U TESTIMONIALS SEKCIJI //

    $(document).ready(function () {
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
    });    

    // D.I. SLAJDOVA U POMENUTOJ SEKCIJI //

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
                        <img src="./assets/img/person${index + 1}.jpg" class="card-img-top" alt="Slide ${index + 1} image">
                        <div class="card-body">
                            <h5 class="card-title orange">${text.name}</h5>
                            <p class="card-text text-dark">${text.text}</p>
                        </div>
                    </div>`
    );   

    // D.I. DUGMADI U NEWSLETTER SEKCIJI //

    dynamicCreating(formButtons, document.getElementById("newsletter-buttons"),
    (text) => `<input type="${text.type}" ${text.disabled} id="newsletter-${text.type}" name="newsletter-${text.type}" value="${text.value}" class="${text.class} strict-white rounded px-2 py-1 my-3 mx-2"/>`
    );

    // OBRADA FORME U NEWSLETTER SEKCIJI // 

    const newsletterForm = document.getElementById("newsletter-form");
    const newsletterInput = document.getElementById("newsletter-email");
    const newsletterInputSmall = document.getElementById("newsletter-email-small");
    const newsletterSubmit = document.getElementById("newsletter-submit");
    const newsletterFormSmall = document.getElementById("newsletter-form-small");
    const newsletterSmalls = document.getElementsByClassName("newsletter-small");

    const newsletterInputs = [
        {
            element: newsletterInput, 
            type: "input", 
            touched: false, 
            required: true,
            validate: () => inputCheck(true, "input", emailRegEx, newsletterInput, newsletterInputSmall, "Email must contain @ and .", "Email field is required.")
        }
    ];

    formEvents(newsletterInputs, newsletterSubmit, newsletterFormSmall);
    submitEnabler(contactInputs, newsletterSubmit, newsletterFormSmall); 
    submited(newsletterForm, newsletterFormSmall);
    resetForm(newsletterForm, newsletterInputs, newsletterSmalls, newsletterFormSmall, newsletterSubmit); 
}

// KRAJ KODA KOJI NE TREBA DA SE IZVRŠI U AUTHOR.HTML //

// D.I. FOOTERA //

const footerRows = ["footer-content", "footer-end"];

dynamicCreating(footerRows, document.querySelector("footer"),
    (text) => `<div id="${text}" class="row pb-2"></div>`
);

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
    (text) => `<div class="col-md-3 col-sm-6 col-12 d-flex flex-column align-items-center my-3">
                    <h5 class="orange">${text.title}</h5> 
                    <ul id="footer-${text.id}"></ul>   
                </div>`
);    

dynamicCreating(navLinks, document.getElementById("footer-navigation"),
    (text) => `<li class="nav-item"><a href="index.html#${text.path}" class="nav-link my-2">${text.name}</a></li>`
);

const footerServices = ["Home", "Gate", "Window", "Machine", "Bike", "Car"]

dynamicCreating(footerServices, document.getElementById("footer-services"),
    (text) => `<li class="my-2">${text} welding</li>`
); 

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

const footerEndBlocks = [`<ul class="m-0 pt-5 d-flex justify-content-center" id="footer-socials"></ul>`, '<p id="copyright" class="strict-white pt-5 m-0"></p>'];

dynamicCreating(footerEndBlocks, document.getElementById("footer-end"),
    (text) => `<div class="col-sm-6 col-12 d-flex justify-content-center">
                    ${text}
                </div>`
); 

// ISPIS DANAŠNJE GODINE U ELEMENTU SA ID COPYRIGHT //

document.addEventListener("DOMContentLoaded", () => {
    const date = new Date();
    const year = date.getFullYear();
    document.getElementById("copyright").innerHTML = `&copy; ${year} WeldPro. All right reserved.`;
});

// KRAJ ISPISA //

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
    (text) => `<li><a class="strict-white mx-3" href="${text.path}"><i class="${text.icon}"></i></a></li>`
);



















