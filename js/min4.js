
/* ---- js/init.js ---- */
/*
 * Obtencion de archivos JS de manera paralela y carga sincronica
 */
//loadjs(['https://kit.fontawesome.com/bf671ef02a.js', 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js', '/js/ramos.js', '/js/canvas.js'], 'init');
/*loadjs.ready('init', {
    success: function() { console.log("Recursos cargados") },
    error: function(depsNotFound) {
        Swal.fire(
            "Fallo al cargar",
            "Tuvimos problemas al cargar algunas dependencias... el sitio se recargara en 5 segundos.",
            "error"
        );
        setTimeout(function(){
            location.reload();
        }, 5000);
    },
});*/

(function () { // comment out this if needed
  const allowedHosts = ['localhost', 'booterman98.github.io', 'cocobasualto.github.io']; 
  const currentHost = window.location.hostname;

  if (!allowedHosts.includes(currentHost)) {
    window.location.href = 'https://booterman98.github.io/malla-interactiva/';
  }
})();

let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

function render(props) {
    return function(tok, i) {
        return (i % 2) ? props[tok] : tok;
    };
}
let relaPath = './'
let prioridad = document.URL.includes('prioridad')
let personalizar = document.URL.includes('personalizar')
let mallaPersonal = document.URL.includes("malla.")
let contact = document.URL.includes("contact")
let fullCareerName = ""
let homologatedTo = null
let homologatedName = ""
let texts = "Malla"
if (mallaPersonal)
    texts = "Personal"
else if (prioridad)
    texts = "Prioridad"
else if (personalizar)
    texts = "Generadora"

if (texts !== "Malla" || contact) {
    relaPath = '../'
}
// Disabled due to safari bug
/*if ('serviceWorker' in navigator) {
    console.log("Service worker compatible")
    window.addEventListener('load', function() {
        navigator.serviceWorker.register(relaPath + 'serviceWorker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}*/

let params = new URLSearchParams(window.location.search)

let carr = localStorage.getItem("currentCarreer")

if (params.get('m')) {
    carr = params.get('m')
    localStorage.setItem("currentCarreer", carr)
}

// update the url for feedback
if (carr) {
    let url = new URL(window.location.href)
    url.searchParams.set('m', carr)
    window.history.pushState({}, '', url);
}


if (!carr)
    carr = 'INF'

let sct = true
if (params.get('SCT') === "false")
    sct = false

// document.addEventListener("DOMContentLoaded", loadViews)
//
// window.addEventListener("load", function () {console.log("load")})
// function loadViews() {
    // obtener vistas
    let includes = document.querySelectorAll('[data-include]')
    let promises = []
    let welcomeTexts = {}
    includes.forEach(include => {
        let fileURL = relaPath + 'views/' + include.attributes['data-include'].nodeValue + '.html';
        promises.push(fetch(fileURL).then(response => response.text())
            .then(data => {
                include.insertAdjacentHTML("afterbegin", data)
            }))
    })
    let fileURL = relaPath + "data/welcomeTexts.json"
    promises.push(fetch(fileURL).then(response => response.json()))
    Promise.all(promises)
        .then( () => {
            return fetch(new Request(relaPath + "date.txt"))
        }).then(response => {
            let lastModified = response.headers.get("last-modified")
            let date = new Date(lastModified)
            console.log(date)
            document.getElementById("lastUpdate").textContent = date.toLocaleString()
        })
    let bigPromise = Promise.all(promises).then((datas) => {
        welcomeTexts = datas.pop()[texts]

        let home = document.getElementById("goToHome")
        let calculator = document.getElementById("goToCalculator")
        let generator = document.getElementById("goToGenerator")
        let goToContact = document.getElementById("contact")
        if (!mallaPersonal) {
            if (!prioridad)
                calculator.setAttribute("href", relaPath + 'prioridad/?m=' + carr)
            else
                calculator.classList.add("active")
            if (!personalizar)
                generator.setAttribute("href", relaPath + 'personalizar/?m=' + carr)
            else {
                generator.classList.add("active")
                document.getElementById("generate").setAttribute("href", "./malla.html?m=" + carr)
            }
        } else
            generator.setAttribute("href", relaPath + 'personalizar/?m=' + carr)
        if (contact)
            goToContact.classList.add("active")
        goToContact.setAttribute("href", relaPath + "contact/")
        home.setAttribute("href", relaPath + '?m=' + carr)
        return fetch(relaPath + '/data/carreras.json')
    }).then(response => response.json()).then((careers,) => {
        //if (!mallaPersonal) {
            let tabTpl1 = document.querySelector('script[data-template="tab-template1"]').text.split(/\${(.+?)}/g);
            let tabTpl2 = document.querySelector('script[data-template="tab-template2"]').text.split(/\${(.+?)}/g);
            if (contact) {
                document.querySelectorAll(".carrers").forEach(element => element.remove())
            }

            careers.forEach(career => {
                if (career['Link'] === carr) {
                    fullCareerName = career["Nombre"]
                    homologatedTo = career["homologatedTo"]
                    welcomeTexts["welcomeTitle"] = welcomeTexts["welcomeTitle"].replace("CARRERA", career['Nombre'])
                    $('.carrera').text(career['Nombre'])
                    if (mallaPersonal) {
                     let title = document.title
                     document.title = title + " basada en " + career['Nombre']
                    } else {
                        let title = document.title.slice(0, 17)
                        title += " " + career['Nombre']
                        title += document.title.slice(17)
                        document.title = title
                    }
                }
            });

            homo = careers.find((career) => career['Link'] == homologatedTo)
            if (homo != null) {
                homologatedName = homo["Nombre"]
            }
            $('#carreras1-nav').append(careers.map(function (values) {
                return tabTpl1.map(render(values)).join('');
            }));
            $('#carreras2-nav').append(careers.map(function (values) {
                return tabTpl2.map(render(values)).join('');
            }));
            if ( document.querySelector(".overlay-content h1")){
            document.querySelector(".overlay-content h1").textContent = welcomeTexts["welcomeTitle"]
            document.querySelector(".overlay-content h5").textContent = welcomeTexts["welcomeDesc"]
        }
    })
// }

function removeHomologatedPopUp() {
    d3.selectAll(".inset-overlay").style("-webkit-backdrop-filter", "blur(0px) contrast(100%)");
    d3.selectAll(".inset-overlay").style("backdrop-filter", "blur(0px) contrast(100%)");
    d3.select(".overlay-content").transition().style("filter", "opacity(0)")
    d3.select(".inset-overlay").transition().style("filter", "opacity(0)").on('end', function() {
        d3.select(this).remove();
    })
}
function removePopUp() {
    d3.select("body").style("overflow", "initial")
    d3.selectAll(".overlay").style("-webkit-backdrop-filter", "blur(0px) contrast(100%)");
    d3.selectAll(".overlay").style("backdrop-filter", "blur(0px) contrast(100%)");
    d3.select(".overlay-content").transition().style("filter", "opacity(0)")
    d3.select(".overlay").transition().style("filter", "opacity(0)").on('end', function() {
        d3.select(this).remove();
    })
}

function doRendering () {
    let fulfillBeforeFirstRender = []
      if (contact)
          return

      if (sct) {
          document.getElementById("creditsExample").textContent = "Créditos SCT";
          let credit = parseInt(document.getElementById("creditsNumberExample").textContent);
          document.getElementById("creditsNumberExample").textContent = (Math.round(credit * 5 / 3)).toString()
      }


      let malla = null
      let semesterManager = null
      if (prioridad) {
          malla = new Malla(sct, SelectableRamo, 0.804, 1)
          malla.enableCreditsSystem()
          document.getElementById("custom-credits-USM").addEventListener("input", function updateSCTPlaceholder() {
              if (this.value == "")
                  document.getElementById("custom-credits-SCT").setAttribute("placeholder", "Ingrese un valor")
              else
                  document.getElementById("custom-credits-SCT").setAttribute("placeholder", Math.round(this.value * 5/3).toString())
          })

      } else if (personalizar && !mallaPersonal) {
          malla = new Malla(sct, SelectableRamo, 0.804, 1)
          malla.enableCreditsSystem()
          document.getElementById("custom-credits-USM").addEventListener("input", function updateSCTPlaceholder() {
              if (this.value == "")
                  document.getElementById("custom-credits-SCT").setAttribute("placeholder", "Ingrese un valor")
              else
                document.getElementById("custom-credits-SCT").setAttribute("placeholder", Math.round(this.value * 5/3).toString())
          })
          document.getElementById("custom-creditsa-USM").addEventListener("input", function updateSCTPlaceholder() {
              if (this.value == "")
                  document.getElementById("custom-creditsa-SCT").setAttribute("placeholder", "Ingrese un valor")
              else
                  document.getElementById("custom-creditsa-SCT").setAttribute("placeholder", Math.round(this.value * 5/3).toString())
          })


          //document.getElementById("#reset").addEventListener("click", () => malla.semesterManager.cleanSemester())
          //document.getElementById("#resetc").addEventListener("click", () => malla.semesterManager.cleanAll())
      } else  if (mallaPersonal) {
          malla = new CustomMalla(sct)
          document.getElementById("cleanApprovedButton").addEventListener("click",() => malla.cleanSubjects())
          malla.enableCreditsStats()
          malla.enableCreditsSystem()
      } else {
          malla = new Malla(sct);
          malla.enableCreditsStats()
          malla.enableCreditsSystem()
          malla.enableSave()
           if (homologatedTo != null) {
                let homologatedMalla = new MallaHomologated(sct)
                let manager = new MallaManager(malla, homologatedMalla)
                fulfillBeforeFirstRender.push(homologatedMalla.setCareer(homologatedTo, homologatedName, relaPath))
               document.getElementById("homologate").addEventListener("click", () => manager.renderHomologateMalla())
               document.getElementById("homologate").classList.remove("d-none")
           }
          document.getElementById("cleanApprovedButton").addEventListener("click", () => malla.cleanSubjects())

      }
      fulfillBeforeFirstRender.push(malla.setCareer(carr, fullCareerName, relaPath))
      let drawnMalla = Promise.all(fulfillBeforeFirstRender) .then((val) => {
          return malla.drawMalla(".canvas")
      });
      drawnMalla.then(() => {
          malla.updateStats()
          malla.displayCreditSystem()
          malla.showColorDescriptions(".color-description")
          document.getElementById("overlay").addEventListener("click", () => {
              if (prioridad || personalizar && !mallaPersonal) {
                  malla.semesterManager.loadSemesters()
              } else
                  malla.loadApproved()
              malla.enablePrerCheck()
          })
      })
      drawnMalla.then(() => {
          if (prioridad){
              semesterManager = new Priorix(malla, "#priorix")
              semesterManager.subjectsInManySemesters = true
              semesterManager.mallaEditor.loadSubjects()
          }
          else if (personalizar && !mallaPersonal) {
              semesterManager = new Generator(malla, "#priorix")
              semesterManager.mallaEditor.loadSubjects()
              semesterManager.mallaEditor.loadCategories()
          }
          malla.setSemesterManager(semesterManager)
          malla.generateCode()


      })
  };

function changeCreditsSystem() {
    let key = 'SCT'
    let value = 'false'
    const params = new URLSearchParams(window.location.search);
    if (params.has(key)) {
        value = !('true' === params.get(key))
    }
    key = encodeURI(key); value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--)
{
    x = kvp[i].split('=');

    if (x[0]===key)
    {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
    }
}

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&');
}

bigPromise.then(() => {
    doRendering()
})


/* ---- js/malla.js ---- */
// Futuro remplazo de canvas.js

class Malla {

    constructor(sct = false, subjectType = Ramo, scaleX = 1, scaleY = 1) {

        // Propiedades antes del render
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.subjectType = subjectType;
        this.rawMalla = {};
        this.categories = {};
        this.malla = {};
        this.sct = sct;
        this.longestSemester = 0;
        this.totalCredits = 0;
        this.totalSubjects = 0;
        this.semesterManager = null
        this.currentMalla = null;
        this.generatedCode = []

        // Propiedades despues del render
        this.APPROVED = [];
        this.SUBJECTID = 1;
        this.ALLSUBJECTS = {};
        this.checkPrer = false;
        this.saveEnabled = false;
        this.isMallaSet = false;
        this.isMallaRendered = false
        this.showCreditSystem = false;
        this.showCreditStats = false
        this.canvas = null

        this.totalCredits = 0;
        this.totalSubjects = 0;

        if (document.getElementById("loadfile")) {
            document.getElementById("loadfile").addEventListener("click", this.loadFile.bind(this))
        }

    }

    // Se explica solo
    enableCreditsStats() {
        this.showCreditStats = true
    }

    // Se explica solo
    enableCreditsSystem() {
        this.showCreditSystem = true
    }

    // Habilita el guardado de ramos aprobados para futuras sesiones
    enableSave() {
        this.saveEnabled = true
    }

    // Obtiene los datos de la carrera y retorna una promesa para cuando los datos se hayan conseguido y
    // las propiedades estén listas
    setCareer(carr, fullCareerName, relaPath) {
        if (localStorage["sharedMalla"] != undefined) {
            let unparsedData = localStorage["sharedMalla"]
            localStorage.removeItem("sharedMalla")
            let data = JSON.parse(unparsedData)
            this.currentMalla = data.name;
            this.fullCareerName = data.name
            return Promise.resolve(this.setMallaAndCategories(data.malla, data.categories))

        } else {
            this.currentMalla = carr;
            this.fullCareerName = fullCareerName
            let promises = [];
    
            promises.push(d3.json( relaPath + "data/data_" + this.currentMalla + ".json"));
            promises.push(d3.json( relaPath + "data/colors_" + this.currentMalla + ".json"));
            return Promise.all(promises).then(values => {this.setMallaAndCategories(values[0], values[1])})

        }
    }

    // Define los datos de la malla y propiedades
    setMallaAndCategories(malla, categories) {
        let semester;
        let longest_semester = 0;
        let totalCredits = 0;
        let totalRamos = 0;

        this.rawMalla = malla;
        this.categories = categories;

        for (semester in this.rawMalla) {
            this.malla[semester] = {};

            if (malla[semester].length > longest_semester)
                longest_semester = malla[semester].length;
            malla[semester].forEach(subject => {
                // Se instancia el ramo y se agrega a la malla en su semestre
                totalRamos += 1;
                // Agregado de ramos por semestre
                if (subject.length >= 7) {
                    // Nuevo formato con ramos SCT
                    this.malla[semester][subject[1]] = new this.subjectType(subject[0], subject[1], subject[2], subject[4], subject[5],this.SUBJECTID++, this, subject[3], false ,subject[6])
                } else {
                    // Formato antiguo
                    this.malla[semester][subject[1]] = new this.subjectType(subject[0], subject[1], subject[2], subject[3], (function hasPrer() {
                        if (subject.length > 4) {
                            return subject[4];
                        }
                        return [];
                    })(), this.SUBJECTID++, this);
                }
                // Se agrega el ramo a la lista de asignaturas
                this.ALLSUBJECTS[subject[1]] = this.malla[semester][subject[1]];
                totalCredits += this.malla[semester][subject[1]].getDisplayCredits()
            });
        }
        this.longestSemester = longest_semester;
        this.totalCredits = totalCredits;
        this.totalSubjects = totalRamos;
        this.isMallaSet = true;
    }

    // Define el controlador de semestres para que las asignaturas puedan acceder a el
    setSemesterManager(semesterManager) {
        this.semesterManager = semesterManager
    }

    // Agrega ramos a la malla
    addSubject(subject) {
        this.ALLSUBJECTS[subject.sigla] = subject
    }

    // Elimina ramos de la malla y todo rastro de ellos
    delSubjects(subject) {
        Object.values(this.ALLSUBJECTS).forEach(otherSubject => {
            // Elimina el ramo como prerrequisito de otros
            if (otherSubject.prer.has(subject.sigla)){
                otherSubject.prer.delete(subject.sigla)
                otherSubject.verifyPrer()
            }
        })
        delete this.ALLSUBJECTS[subject.sigla]
    }

    // Renderiza la malla. canvasId puede ser una clase o una id
    drawMalla(canvasId) {

        if (!this.isMallaSet)
            return;

        let separator = 10;
        let semesterIndicatorHeight = 30 * this.scaleY;
        // Se define el tamaño
        let width = (this.subjectType.getDisplayWidth(this.scaleX) * Object.keys(this.malla).length) +
            separator * (Object.keys(this.malla).length - 1);
        let height = (this.subjectType.getDisplayHeight(this.scaleY) + separator) * this.longestSemester +
            semesterIndicatorHeight * 2 + separator;
        let canvasWidth = width + separator; // for full show svg
        let canvasHeight = height + separator/2

        this.canvas = d3.select(canvasId).append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .attr("role", "figure");

        this.canvas.append("title")
            .text("Malla " + this.fullCareerName)

        const drawer = this.canvas;
        let globalX = separator / 2,
            globalY = 0;
        let isBigBarRendered = false;
        let semestersPassed = 0;
        let currentYear = 0;
        let currentYearIndicator = null;
        let currentYearIndicatorText = null;
        let yearIndicator = null;

        Object.keys(this.malla).forEach(semester => {
            globalY = 0;
            // Barra indicadora de años
            if (semestersPassed === 0) {
                yearIndicator = drawer.append("g")
                    .attr("cursor", "pointer")
                    .attr("role", "heading")
                    .attr("aria-level", "5")
                    .classed("year", true);
                // se crea la barra en caso de semestre impar
                let desc = yearIndicator.append("title")
                // rectangulo de la barra
                currentYearIndicator = yearIndicator.append("rect")
                    .attr("x", globalX)
                    .attr("y", globalY)
                    .attr("width", this.subjectType.getDisplayWidth(this.scaleX))
                    .attr("height", semesterIndicatorHeight)
                    .attr("fill", 'gray')
                    .classed('bars', true);
                semestersPassed++;
                // texto de la barra
                currentYearIndicatorText = yearIndicator.append("text")
                    .attr('x', globalX + this.subjectType.getDisplayWidth(this.scaleX) / 2.0)
                    .attr('y', globalY + semesterIndicatorHeight / 2)
                    .text("Año " + currentYear++ + " 1/2")
                    // .attr("font-family", "sans-serif")
                    .attr("font-weight", "bold")
                    .attr("fill", "white")
                    .attr("dominant-baseline", "central")
                    .attr('text-anchor', 'middle');
                desc.text("Año " + currentYear + " 1/2")
                // Evento en caso de hacer click en el
                yearIndicator.on("click", () => {
                    let bar = d3.select(d3.event.currentTarget)
                    let number = parseInt(bar.select("text").text().substr(4));
                    let ramosToSelect;
                if (bar.node().getBBox().width <= this.subjectType.getDisplayWidth(this.scaleX) * 2 - this.subjectType.getDisplayWidth(this.scaleX) / 2) {
                    this.canvas.select("#sem" + (number * 2 + 1)).dispatch('click')
                } else {
                    this.canvas.select("#sem" + number * 2).dispatch('click');
                    this.canvas.select("#sem" + (number * 2 - 1)).dispatch('click')

                }

                });
            } else {
                // si es par, la actual se expande
                currentYearIndicator.attr("width", this.subjectType.getDisplayWidth(this.scaleX) * 2 + separator);
                currentYearIndicatorText.text("Año " + (currentYear));
                currentYearIndicatorText.attr("x", globalX - separator / 2);
                semestersPassed = 0;
                yearIndicator.select("title").text("Año "+ (currentYear))
            }

            globalY += semesterIndicatorHeight + separator;

            // Barra gigante de semestres
            if (!isBigBarRendered) {
                // Se crea la barra
                drawer.append("rect")
                    .attr("x", globalX)
                    .attr("y", globalY)
                    .attr("width", width)
                    .attr("height", semesterIndicatorHeight)
                    .attr("fill", '#EEE')
                    .classed("sem", true);
                isBigBarRendered = true;
            }

            // Pequeño seteo de variables en caso de que semestre sea "S1" o 1 por ejemplo
            let intToRomanize = semester
            if (intToRomanize[0] === "s") {
                intToRomanize = parseInt(intToRomanize.substr(1))
            } else {
                intToRomanize = parseInt(intToRomanize)
            }

            // barra de semestres individuales
            let semesterIndicator = drawer.append("g")
                .attr("id", "sem" + intToRomanize)
                .attr("cursor", "pointer")
                .attr("width", this.subjectType.getDisplayWidth(this.scaleX))
                .attr("height", semesterIndicatorHeight)
                .attr("role", "heading")
                .attr("aria-level", "6")
                .classed("sem", true);

            semesterIndicator.append("title").text("Semestre " + intToRomanize)



            semesterIndicator.append("rect")
                .attr("cursor", "pointer")
                .attr("x", globalX)
                .attr("y", globalY)
                .attr("width", this.subjectType.getDisplayWidth(this.scaleX))
                .attr("height", semesterIndicatorHeight)
                .classed("sem", true)
                .attr("fill", '#EEE');


            semesterIndicator.append("text")
                .attr('x', globalX + this.subjectType.getDisplayWidth(this.scaleX) / 2.0)
                .attr('y', globalY + semesterIndicatorHeight / 2)
                .text(this.romanize(intToRomanize))
                .attr("dominant-baseline", "central")
                .attr('text-anchor', 'middle');
            // evento en caso de clickear la barra del semestre
            semesterIndicator.on("click", () => {
                let bar = d3.select(d3.event.currentTarget)
                let semNumber = this.deRomanize(bar.select("text").text());
                if (semester[0] === "s")
                    semNumber = "s" + semNumber
                Object.values(this.malla[semNumber]).forEach(ramo => {
                    ramo.isBeingClicked()
                })

            });

            globalY += semesterIndicatorHeight + separator;

            // Se renderizan los ramos del semestre
            Object.keys(this.malla[semester]).forEach(subject => {
                this.malla[semester][subject].draw(drawer, globalX, globalY, this.scaleX, this.scaleY);
                globalY += this.subjectType.getDisplayHeight(this.scaleY) + separator;
            })


            globalX += this.subjectType.getDisplayWidth(this.scaleX) + separator;
        })
        this.isMallaRendered = true
    }

    // Renderiza las descripciones de las categorías
    showColorDescriptions(className=".color-description") {
        Object.keys(this.categories).forEach(key => {
            let color_description = d3.select(className).append("div")
                .attr("style", "display:flex;vertical-align:middle;margin-right:15px;");
            let circle_color = color_description.append("svg")
                .attr("height", "25px")
                .attr("width", "25px");
            circle_color.append("circle")
                .attr("r", 10)
                .attr("cx", 12)
                .attr("cy", 12)
                .attr("fill", this.categories[key][0]);

            color_description.append("span").text(this.categories[key][1]);

        });
    }

    // Permite que se revise si los ramos cumplen prerrequisitos
    enablePrerCheck() {
        this.checkPrer = true;
        this.verifyPrer()
    }

    // Revisa que ramos cumplen prerrequisitos y "oculta" los que no los cumplen
    verifyPrer() {
        if (this.checkPrer) {
            Object.values(this.ALLSUBJECTS).forEach(ramo => {
                ramo.verifyPrer();
            });
            this.saveApproved()
        }
    }

    // Retorna el sistema de créditos utilizado
    displayCreditSystem() {
        if (!this.showCreditSystem)
            return
        d3.select("#credits-system").text(this.sct ? 'SCT' : 'USM')
    }

    // Actualiza los datos como porcentaje de ramos aprobados etc
    updateStats() {
        if (!this.showCreditStats)
            return
        let currentCredits = 0;
        let currentRamos = 0;
        this.APPROVED.forEach(ramo => {
            currentCredits += ramo.getDisplayCredits();
            currentRamos += 1
        })
        let creditPercentage = currentCredits/this.totalCredits * 100;
        let careerAdvance = currentRamos/this.totalSubjects * 100;
        d3.select("#credits").text(parseInt(currentCredits))
        d3.select("#credPercentage").text(parseInt(creditPercentage))
        d3.select("#ramoPercentage").text(parseInt(careerAdvance))
    }

    // Limpia los ramos aprobados
    cleanSubjects() {
        let listToClean = [...this.APPROVED]
        listToClean.forEach(ramo => {
            ramo.cleanRamo()
        })
        this.verifyPrer()
        this.updateStats()
    }


    // Auto explanatorio
    approveSubject(subject) {
        this.APPROVED.push(subject)
    }

    // Auto explanatorio
    deApproveSubject(subject) {
        let _i = this.APPROVED.indexOf(subject);
        if (_i > -1) {
            this.APPROVED.splice(_i, 1);
        }
    }

    getSubject(sigla) {
        return this.ALLSUBJECTS[sigla]
    }

    // Auto explanatorio
    saveApproved() {
        if (this.saveEnabled) {
            let cacheName = "approvedRamos_" + this.currentMalla;
            let cacheToSave = [];
            this.APPROVED.forEach(ramo => {
                cacheToSave.push(ramo.sigla)
            });
            localStorage[cacheName] = JSON.stringify(cacheToSave);
        }
    }

    // Auto explanatorio
    loadApproved() {
        if (this.saveEnabled) {
            let cache = localStorage["approvedRamos_" + this.currentMalla]
            if (cache) {
                let loadedData = JSON.parse(cache)
                loadedData.forEach(siglaRamo => {
                    if (this.ALLSUBJECTS[siglaRamo] !== undefined)
                        this.ALLSUBJECTS[siglaRamo].approveRamo()
                })
                this.verifyPrer()
            }
        }
    }

    // EXTRA

    deRomanize(roman){
        let r_nums = this.getRnums();
        let a_nums = this.getAnums();
        let remainder = roman.replace(/i/g, "M");
        let arabic = 0, count = 0, test = remainder;

        let len=r_nums.length;
        for (let i=1; i<len; ++i ){
            const numchrs = r_nums[i].length;
            while( remainder.substr(0,numchrs) === r_nums[i]){
                if((count++) > 30) return -1;
                arabic += a_nums[i];
                remainder = remainder.substr(numchrs,remainder.length-numchrs);
            }
            if(remainder.length <= 0) break;
        }
        if(remainder.length !==0 ){
            alert(roman + " INVALID truncating to "+test.replace(remainder,'') );
        }
        if( (0 < arabic) && (arabic < 4000000) )return arabic;
        else return -1;
    }

    romanize(arabic) {
        if (arabic > 3999999 || arabic < 1) {
            return 'Expect number from 1 to 3,999,999';
        }
        let r_nums = this.getRnums();
        let a_nums = this.getAnums();
        let remainder = parseInt(arabic);
        let roman = '', count = 0;

        let len = r_nums.length;
        for (let i = 1; i < len; ++i) {
            while (remainder >= parseInt(a_nums[i])) {
                if ((count++) > 30) return -1;
                roman = roman + r_nums[i];
                remainder = remainder - a_nums[i];
            }
            if (remainder <= 0) break;
        }
        return roman;
    }


    getRnums() {
        let r_nums = Array();
        r_nums[1] = 'm';
        r_nums[2] = 'cm';
        r_nums[3] = 'd';
        r_nums[4] = 'cd';
        r_nums[5] = 'c';
        r_nums[6] = 'xc';
        r_nums[7] = 'l';
        r_nums[8] = 'xl';
        r_nums[9] = 'x';
        r_nums[10] = 'Mx';
        r_nums[11] = 'v';
        r_nums[12] = 'Mv';
        r_nums[13] = 'M';
        r_nums[14] = 'CM';
        r_nums[15] = 'D';
        r_nums[16] = 'CD';
        r_nums[17] = 'C';
        r_nums[18] = 'XC';
        r_nums[19] = 'L';
        r_nums[20] = 'XL';
        r_nums[21] = 'X';
        r_nums[22] = 'IX';
        r_nums[23] = 'V';
        r_nums[24] = 'IV';
        r_nums[25] = 'I';
        return r_nums;
    }

    getAnums() {
        let a_nums = Array();
        a_nums[1] = 1000000;
        a_nums[2] = 900000;
        a_nums[3] = 500000;
        a_nums[4] = 400000;
        a_nums[5] = 100000;
        a_nums[6] = 90000;
        a_nums[7] = 50000;
        a_nums[8] = 40000;
        a_nums[9] = 10000;
        a_nums[10] = 9000;
        a_nums[11] = 5000;
        a_nums[12] = 4000;
        a_nums[13] = 1000;
        a_nums[14] = 900;
        a_nums[15] = 500;
        a_nums[16] = 400;
        a_nums[17] = 100;
        a_nums[18] = 90;
        a_nums[19] = 50;
        a_nums[20] = 40;
        a_nums[21] = 10;
        a_nums[22] = 9;
        a_nums[23] = 5;
        a_nums[24] = 4;
        a_nums[25] = 1;
        return a_nums;
    }

    // Genera código de la malla generada para poder actualizar o agregar carreras
    generateCode() {
        let data = {}
        let expresion1 = /("s[0-9]+":)+|(\[(?:,?[^\[\]])+(?:,\[[^\]]*])(?:,?[^\]]*)+])+/g

        // Se crea la data a guardar según el formato de la malla
        Object.keys(this.malla).forEach(semester => {
            let key
            if (semester.includes("s"))
                key = semester
            else
                key = "s" + semester
            data[key] = []

            Object.keys(this.malla[semester]).forEach(sigla => {
                let subject = this.ALLSUBJECTS[sigla]
                let subjectData = []

                subjectData.push(subject.name)
                subjectData.push(subject.sigla)
                subjectData.push(subject.getUSMCredits())
                if (subject.USMtoSCT)
                    subjectData.push(0)
                else
                    subjectData.push(subject.getSCTCredits())

                subjectData.push(subject.category)
                subjectData.push([...subject.prer])
                subjectData.push(subject.dictatesIn)
                data[key].push(subjectData)

            })
        })

        // Luego se crea el string de la data y se le da el formato
        let mallaResult = JSON.stringify(data).match(expresion1);

        let s = "{\n"
        let first = true
        let firstSem = true
        mallaResult.forEach(item => {
            if (/("s[0-9]+":)/.test(item)) {
                if (firstSem) {
                    s += "    " + item + " [\n"
                    firstSem = false
                } else {
                    s += "\n    ],\n" + "    " + item + " [\n"
                }
                first = true
            } else if (first) {
                s += "        " + item
                first = false
            } else
                s += ",\n" + "        " + item
        })
        s += "\n" + "    " + "]\n" + "}"

        // Se repite el proceso con las categorías
        let expresion2 = /("[^\]]+\],?)/g
        let colorResult = JSON.stringify(this.categories).match(expresion2)
        let c = "{"
        colorResult.forEach(color => {
            c += "\n" + "    " + color
        })
        c += "\n}"
        this.generatedCode = [this.currentMalla,s,c]

        let shareCode = `{\n "name": "${this.generatedCode[0]}",\n "malla": ${this.generatedCode[1]},\n "categories": ${this.generatedCode[2]}\n}`
        // Si existe el lugar para mostrarlo, se muestra
        if (document.getElementById('mallaCode')) {
            new ClipboardJS('.btn');
            document.getElementById('mallaCode').textContent = s;
            document.getElementById('colorCode').textContent = c
            PR.prettyPrint()

            document.getElementById('abrev').value = this.currentMalla
            document.getElementById("carrMalla1").textContent = this.currentMalla
            document.getElementById("carrMalla2").textContent = this.currentMalla
            document.getElementById("carrColor1").textContent = this.currentMalla
            document.getElementById("carrColor2").textContent = this.currentMalla

            let file1 = new Blob([s], {"aplication/json": "aplication/json"});
            let file2 = new Blob([c], {"aplication/json": "aplication/json"});
            let file3 = new Blob([shareCode], {"aplication/json": "aplication/json"});
            let downloadLink1 = document.getElementById('dMalla')
            let downloadLink2 = document.getElementById('dColor')
            let downloadLink3 = document.getElementById('dShare')
            downloadLink1.setAttribute('href', URL.createObjectURL(file1))
            downloadLink1.setAttribute('download', "data_" + this.currentMalla + '.json')
            downloadLink2.setAttribute("href", URL.createObjectURL(file2))
            downloadLink2.setAttribute("download", "colors_" + this.currentMalla + '.json')
            downloadLink3.setAttribute('href', URL.createObjectURL(file3))
            downloadLink3.setAttribute('download', this.currentMalla + '.json')

        } else {
            // Si no, se imprime en la consola
            console.log(s)
            console.log(c)

        }
        if (document.getElementById("abrev")) {
            document.getElementById("abrev").addEventListener('input', function (input) {
                document.getElementById("carrMalla1").textContent = input.target.value.toUpperCase()
                document.getElementById("carrMalla2").textContent = input.target.value.toUpperCase()
                document.getElementById("carrColor1").textContent = input.target.value.toUpperCase()
                document.getElementById("carrColor2").textContent = input.target.value.toUpperCase()
                document.getElementById('dMalla').setAttribute('download', "data_" + input.target.value.toUpperCase() + '.json')
                document.getElementById('dColor').setAttribute("download", "colors_" + input.target.value.toUpperCase() + '.json')
                // console.log(this.generatedCode[0])
                this.generatedCode[0] = input.target.value

                $('[data-toggle="tooltip"]').tooltip()
                $('[data-toggle="tooltip"]').tooltip('disable')


                let downloadLink3 = document.getElementById('dShare')
                let shareCode = `{\n "name": "${this.generatedCode[0]}",\n "malla": ${this.generatedCode[1]},\n "categories": ${this.generatedCode[2]}\n}`
                let file3 = new Blob([shareCode], {"aplication/json": "aplication/json"});

                downloadLink3.setAttribute('href', URL.createObjectURL(file3))
                downloadLink3.setAttribute('download', this.generatedCode[0] + '.json')
            }.bind(this))
        }
    }

    loadFile(e) {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json'
        input.multiple = false
        var reader = new FileReader();
        reader.addEventListener("load", function (e) {
            localStorage["sharedMalla"] = e.target.result;
            location.reload()
        });
    
        input.onchange = _this => {
            let files =   Array.from(input.files);
                reader.readAsText(files[0]);
    
              };
        input.click();
    
    }
}


/* ---- js/ramo.js ---- */
let width = 100;
let height = 100;

class Ramo {
    static get width() {
        return width
    }

    static get height() {
        return height
    }

    static getDisplayWidth(scaleX) {
        return width * scaleX;
    }

    static getDisplayHeight(scaleY){
        return height * scaleY;
    }


    constructor(name, sigla, credits, category, prer = [], id, malla, creditsSCT = 0, isCustom = false, dictatesIn="") {
        // Propiedades del ramo
        this.name = name;
        this.sigla = sigla;
        this.credits = credits;
        this.category = category;
        this.prer = new Set(prer);
        if (creditsSCT){
            this.creditsSCT = creditsSCT
            this.USMtoSCT = false
        } else {
            this.creditsSCT = Math.round(credits * 5 / 3)
            this.USMtoSCT = true
        }
        this.dictatesIn = dictatesIn

        // Propiedades para renderizado e interacciones
        this.malla = malla
        this.isCustom = isCustom
        this.beenEdited= false
        this.id = id;
        this.ramo = null;
        this.approved = false;
        //console.log(this.category)
    }

    // Auto explanatorio
    getSCTCredits() {
        return this.creditsSCT
    }

    // Auto explanatorio
    getUSMCredits() {
        return this.credits;
    }

    // Actualiza uno o ambos créditos dependiendo de los valores de entrada
    updateCredits(creditsUSM, creditsSCT = 0) {
        this.credits = creditsUSM
        if (creditsSCT)
            this.creditsSCT = creditsSCT
        else
            this.creditsSCT = Math.round(creditsUSM * 5 / 3)
    }

    // Retorna los creditos del tipo correcto según como el usuario lo pida
    getDisplayCredits() {
        if (this.malla.sct) {
            return  this.getSCTCredits()
        } else {
            return this.getUSMCredits()
        }
    }

    // renderiza el ramo
    draw(canvas, posX, posY, scaleX, scaleY) {
        this.ramo = canvas.append('g')
            .attr("cursor", "pointer")
            .attr("role", "img")
            .classed("subject", true)
            // .attr("alt", "Texto de prueba")
            .attr('id', this.sigla);
        // Se establecen tamaños
        let sizeX = this.constructor.getDisplayWidth(scaleX),
            sizeY = this.constructor.getDisplayHeight(scaleY);
        let graybar = sizeY / 5;
        let credits = this.getDisplayCredits(this.credits);
        let color = this.malla.categories[this.category][0]

        let dictatesIn = {"":"¿ambos semestres?", "P": "semestres pares", "I": "semestres impares", "A": "ambos semestres"}
        let prers = ""
        let prerSize = this.prer.size - 1
        let counter = 0
        this.prer.forEach(prer => {
            if (counter === 0)
                prers += prer
            else if (counter === prerSize)
                prers += " y " + prer
            else
                prers += ", " + prer
            counter +=1
        })
        this.ramo.append("title").text(
            "Ramo " + this.sigla+ ", " + this.name+ ". Este ramo tiene " +
            this.getSCTCredits() + " créditos SCT. Se dicta en " + dictatesIn[this.dictatesIn] + " y "
            + (this.prer.size ? "tiene como prerrequisitos a " + prers : "no tiene prerrequisitos") + ".")

        this.ramo.append("rect")
            .attr("x", posX)
            .attr("y", posY)
            .attr("width", sizeX )
            .attr("height", sizeY)
            .attr("fill", color);

        // above bar
        this.ramo.append("rect")
            .attr("x", posX)
            .attr("y", posY)
            .attr("width", sizeX )
            .attr("height", graybar)
            .attr("fill", '#6D6E71')
            .classed('bars', true);

        // below bar
        this.ramo.append("rect")
            .attr("x", posX)
            .attr("y", posY + sizeY - graybar)
            .attr("width", sizeX )
            .attr("height", graybar)
            .attr("fill", '#6D6E71')
            .classed('bars', true);

        // credits rect
        this.ramo.append("rect")
            .attr("x", posX + sizeX  - 22 * scaleX)
            .attr("y", posY + sizeY - graybar)
            .attr("width", 20 * scaleX)
            .attr("height", graybar)
            .attr("fill", 'white');

        // texto créditos
        this.ramo.append("text")
            .attr("x", posX + sizeX  - 22 * scaleX + 20 * scaleX / 2)
            .attr("y", posY + sizeY - graybar / 2)
            .text(credits)
            .attr("font-weight", "regular")
            .attr("fill", "black")
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr("font-size", 12 * scaleY);

        // Nombre ramo
        this.ramo.append("text")
            .attr("x", posX + sizeX  / 2)
            .attr("y", posY + sizeY / 2)
            .attr("dy", 0)
            .text(this.name)
            .attr("class", "ramo-label")
            .attr("fill", () => {
                if (this.needsWhiteText(color))
                    return "white";
                return '#222222';
            })
            .attr("font-size", 13)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central");

        // Sigla
        this.ramo.append("text")
            .attr("x", posX + 2)
            .attr("y", posY + 10)
            .attr("dominant-baseline", "central")
            .text(this.sigla)
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("font-size", scaleX < 0.85 ? 11 : 12);

        // Indicador the semestres
        if (this.dictatesIn === "P" || this.dictatesIn === "I") {
            this.ramo.append("text")
                .attr("x", posX + sizeX - (scaleX < 0.85 ? 25 : 30))
                .attr("y", posY + 10)

                .attr("dominant-baseline", "central")
                .attr("text-anchor", "middle")
                .text(this.dictatesIn)
                .attr("font-weight", "bold")
                .attr("fill", "yellow")
                .attr("font-size", scaleX < 0.85 ? 11 : 12);
        }
        this.drawActions(posX, posY, sizeX, sizeY);


        // id
        this.ramo.append("circle")
            .attr("cx", posX + sizeX  - 10)
            .attr("cy", posY + graybar / 2)
            .attr("fill", "white")
            .attr("r", 8);
        this.ramo.append("text")
            .attr("x", posX + sizeX  - 10)
            .attr("y", posY + graybar / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr('font-size', 10)
            .text(this.id);

        // prerr circles!
        this.drawPrers(posX, posY, sizeX, sizeY, scaleX);
        this.createActionListeners();
        this.wrap(sizeX - 5, sizeY / 5 * 3);
    }

    drawPrers(posX, posY, sizeX, sizeY, scaleX, graybar = sizeY / 5) {
        let c_x = 0;
        let prerGroup = this.ramo.append("foreignObject");
            prerGroup.attr("x", posX)
            prerGroup.attr("y", posY + sizeY - graybar)
            prerGroup.attr("width", sizeX  - 22 * scaleX)
            prerGroup.attr("height", graybar);
        prerGroup = prerGroup.append("xhtml:div")
        prerGroup.classed("prer-container", true)
        prerGroup = prerGroup.append("svg")
            prerGroup.attr("width", 5)
            prerGroup.attr("height", graybar);

        let startF1RPath = "M18 18 H9 A 9 9 0 0 1 9 0 h18 Z"
        let endF1RPath = "M0 0 H9 A 9 9 0 0 1 9 17 H0 Z"

        this.prer.forEach((p) => {
            let r = 9,
                fontsize = 10,
                variantX = 5;
            let variantY = 5;
            if (scaleX < 0.83) {
                r--;
                fontsize--;
                variantX = 1;
                variantY--;
            }

            if (p.constructor === Array) {

                let pLength = p.length
                p.forEach((subPrer, index) => {
                    prerGroup.attr("width", (r + 1) * 2 + Number(prerGroup.attr("width")));

                    let startF1RPath = `M${r * 2 + c_x + 1 + variantX} ${graybar / 2 + r} H${r + 1 + c_x + variantX} A ${r} ${r} 0 0 1 ${r + 1 + c_x + variantX} ${graybar / 2 - r} H${r * 2 + 1 + c_x + variantX} Z`
                    let midF1RPath = `M${1 + c_x + variantX} ${graybar / 2 - r} H${r * 2 + c_x + 1 + variantX} V${graybar / 2 + r} H${1 + c_x + variantX} Z`
                    let endF1RPath = `M${1 + c_x + variantX} ${graybar / 2 - r} H${r + 1 + c_x + variantX} A ${r} ${r} 0 0 1 ${r + 1 + c_x + variantX} ${graybar / 2 + r} H${1 + c_x + variantX} Z`

                    let prerColor = this.malla.categories[this.malla.ALLSUBJECTS[subPrer].category][0]
                    let pPath = index === 0 ? startF1RPath : (index === pLength - 1 ? endF1RPath : midF1RPath)

                    let prer = prerGroup.append("g")
                    prer.append("path")
                        .attr('d', pPath)
                        .attr('fill', prerColor)
                        .attr('stroke', 'white');
                    prer.append('text')
                        .attr('x',1 + r + c_x + variantX)
                        .attr('y', graybar / 2)
                        .text(this.malla.ALLSUBJECTS[subPrer].id)
                        .attr("dominant-baseline", "central")
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontsize)
                        .attr("dy", 0)
                        .attr('fill', () => {
                            if (this.needsWhiteText(prerColor))
                                return "white";
                            return '#222222';
                        });

                    c_x += r * 2;
                })

            } else {
            prerGroup.attr("width", (r + 1) * 2 + Number(prerGroup.attr("width")));

            let prerColor = this.malla.categories[this.malla.ALLSUBJECTS[p].category][0]
            let prer = prerGroup.append("g")
            prer.append("circle")
                .attr('cx', r + c_x + 1 + variantX)
                .attr('cy', graybar / 2)
                .attr('r', r)
                .attr('fill', prerColor)
                .attr('stroke', 'white');
            prer.append('text')
                .attr('x',1 + r + c_x + variantX)
                .attr('y', graybar / 2)
                .text(this.malla.ALLSUBJECTS[p].id)
                .attr("dominant-baseline", "central")
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("dy", 0)
                .attr('fill', () => {
                    if (this.needsWhiteText(prerColor))
                        return "white";
                    return '#222222';
                });
            c_x += r * 2;
            }
        });
    
    }

    // renderiza las animaciones de interacción
    drawActions(posX, posY, sizeX, sizeY) {
        if (this.ramo == null)
            return null;

        this.ramo.append("rect")
            .attr("x", posX)
            .attr("y", posY)
            .attr("width", sizeX)
            .attr("height", sizeY)
            .attr("fill", 'white')
            .attr("opacity", "0.001")
            .attr("class", "non-approved");

        let cross = this.ramo.append('g').attr("class", "cross").attr("opacity", 0);
        cross.append("path")
            .attr("d", "M" + posX + "," + posY + "L" + (posX + sizeX) + "," + (posY + sizeY))
            .attr("stroke", "#550000")
            .attr("stroke-width", 9);
    }

    // Crea las reacciones a las interacciones del usuario
    createActionListeners() {
        this.ramo.on("click", () => this.isBeingClicked());
    }

    // se llama cuando se pulsa del ramo
    isBeingClicked() {
        this.approveRamo();
        this.malla.verifyPrer();
        this.malla.updateStats();
        this.malla.saveApproved();
    }

    // Auto explanatorio
    approveRamo() {
        if (!this.approved) {
            if (!this.isCustom)
                this.ramo.select(".cross").transition().delay(20).attr("opacity", "1");
            this.malla.approveSubject(this)
        } else {
            if (!this.isCustom)
                this.ramo.select(".cross").transition().delay(20).attr("opacity", "0.01");
            this.malla.deApproveSubject(this)
            }
        this.approved = !this.approved;
    }

    // Se pone el ramo en el estado inicial
    cleanRamo() {
        // Se llama a metodos internos necesarios que "limpien" el ramo
        if (this.approved) {
            this.approveRamo()
        }
    }

    // Se verifica que el ramo tenga los prerrequisitos cumplidos
    verifyPrer() {
        if (this.isCustom)
            return;
        let _a = [];
        this.malla.APPROVED.forEach(function(ramo) {
            _a.push(ramo.sigla);
        });
        _a = new Set(_a);
        for (let r of this.prer) {
            if (r.constructor === Array) {
                for (let subR of r) {
                    if (!_a.has(subR)) {
                        this.ramo.select(".non-approved").transition().delay(20).attr("opacity", "0.71");
                        return;
                    }
                }
            } else if (!_a.has(r)) {
                this.ramo.select(".non-approved").transition().delay(20).attr("opacity", "0.71");
                return;
            }
        }
        this.ramo.select(".non-approved").transition().delay(20).attr("opacity", "0.0");
    }

    // función para encuadrar texto
    wrap(sizeX,sizeY) {
        let text = this.ramo.select(".ramo-label");
        // let emEquivalent = convertEm(1, text.node());
        let words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
/*            y = text.attr("y"),
            dy = 0,*/
            fontsize = parseInt(text.attr("font-size"),10),
            tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("dominant-baseline", "central").attr("dy", 0 + "em"),
            textLines,
            textHeight;
            word = words.pop();
        while (word) {
            line.push(word);
            tspan.text(line.join(" "));
            while (tspan.node().getComputedTextLength() > sizeX) {
                if (line.length === 1) {
                    text.attr("font-size", String(--fontsize));
                }
                else {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    // console.log(lineNumber + 1, lineHeight, dy, (lineNumber + 1) * lineHeight + dy,((lineNumber + 1) * lineHeight + dy) + "em");
                    tspan = text.append("tspan").attr("x", text.attr("x")).attr("dominant-baseline", "central").attr("dy",  lineHeight + "em").text(word);
                }
            }
            word = words.pop();
        }
        let texts = text.selectAll('tspan');
        text.attr("dy", 0); // forzar actualización de ems

        textLines = texts._groups[0].length;
        textHeight = text.node().getBoundingClientRect().height;


        while (textHeight > sizeY - 5) {
            text.attr("font-size", String(--fontsize));
            text.attr("dy", 0); // forzar actualización de ems
            textHeight = text.node().getBoundingClientRect().height;
            lineNumber = 0;
        }

        if (textLines !== 1) {
            let firstTspan = texts.filter(function (d, i) { return i === 0 });
            firstTspan.attr("dy", - (lineHeight * textLines / 2 - lineHeight / 2) + "em");
        }

        text.attr("dy", 0); // forzar actualización de ems


        // Funciones
        // function getElementFontSize(context) {
        //     // Returns a number
        //     return parseFloat(
        //         // of the computed font-size, so in px
        //         getComputedStyle(
        //             // for the given context
        //             context ||
        //             // or the root <html> element
        //             document.documentElement
        //         ).fontSize
        //     );
        // }

        // function convertEm(value, context) {
        //     return value * getElementFontSize(context);
        // }
    }

    // retorna true si el color contrasta mejor con texto blanco
    needsWhiteText(colorHex) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (colorHex.length === 4) {
            r = "0x" + colorHex[1] + colorHex[1];
            g = "0x" + colorHex[2] + colorHex[2];
            b = "0x" + colorHex[3] + colorHex[3];
        } else if (colorHex.length === 7) {
            r = "0x" + colorHex[1] + colorHex[2];
            g = "0x" + colorHex[3] + colorHex[4];
            b = "0x" + colorHex[5] + colorHex[6];
        }
        // console.log(r,g,b)
        // Then to HSL
        let rgb = [0, 0, 0];
        rgb[0] = r / 255;
        rgb[1] = g / 255;
        rgb[2] = b / 255;

        for (let color in rgb) {
            if (rgb[color] <= 0.03928) {
                rgb[color] /= 12.92
            } else {
                rgb[color] = Math.pow(((rgb[color] + 0.055) / 1.055), 2.4)
            }

        }

        // c <= 0.03928 then c = c/12.92 else c = ((c+0.055)/1.055) ^ 2.4
        let l = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
        // console.log(l)
        return l <= 0.6; // este valor deberia ser mas bajo según estandares...
    }

}


/* ---- js/customMalla.js ---- */
class CustomMalla extends Malla {
    constructor(sct = false, ramoType = Ramo, scaleX = 1, scaleY = 1) {
        super(sct, ramoType, scaleX, scaleY);
        this.customSectors = undefined
        this.customSubjects = undefined
        this.customMalla = undefined
    }

    // Hace los mismo que el originar, solo que ademas obtiene primero los datos guardados de la generadora
    setCareer(carr, fullCareerName, relaPath) {
        let customSectors = localStorage["generatorUserCategory" + carr]
        let customSubjects = localStorage["generatorUserSubjects" + carr]
        let customMalla = localStorage["generatorUserData" + carr]
        if (customSubjects !== undefined)
            this.customSubjects = JSON.parse(customSubjects)
        if (customSectors !== undefined)
            this.customSectors = JSON.parse(customSectors)
        if (customMalla !== undefined)
            this.customMalla = JSON.parse(customMalla)

        return super.setCareer(carr, fullCareerName, relaPath);
    }

    setMallaAndCategories(malla, sectors) {
        if (this.customMalla === undefined) {
            super.setMallaAndCategories(malla,sectors)
            return
        }
        let longest_semester = 0;
        let totalCredits = 0;
        let totalRamos = 0;

        let subjectsList = new Set()
        let categoriesToUse = new Set()
        // Se crea una lista de todos los ramos de la malla
        Object.values(this.customMalla).forEach(list => {
            subjectsList = new Set([...subjectsList, ...list])
            if (list.length > longest_semester)
                longest_semester = list.length
            totalRamos += list.length

        })
        this.longestSemester = longest_semester;
        this.totalSubjects = totalRamos

        Object.keys(this.customMalla).forEach(semester => {
            this.malla[semester] = {};
            this.customMalla[semester].forEach(sigla => {

                // Buscar ramo en ramos oficiales
                Object.keys(malla).forEach(semester2 => {
                    let i = 0
                    for (i; i < malla[semester2].length; i++) {
                        if (malla[semester2][i][1] === sigla && this.customSubjects[sigla] === undefined) {
                            // Si se encuentra, y no fue editado
                            let subject = malla[semester2][i]
                            if (subject.length === 7) {
                                // Nuevo formato con ramos SCT
                                let prer = [...subject[5]]
                                categoriesToUse.add(subject[4])
                                prer.forEach(prer => {
                                    // se quitan los prerrequisitos que no estan en la malla
                                    if (!subjectsList.has(prer))
                                        subject[5].splice(subject[5].indexOf(prer),1)
                                })
                                this.malla[semester][sigla] = new this.subjectType(subject[0], subject[1], subject[2], subject[4], subject[5],this.SUBJECTID++, this, subject[3],false ,subject[6])
                            } else {
                                // Formato viejo
                                categoriesToUse.add(subject[3])
                                this.malla[semester][sigla] = new this.subjectType(subject[0], subject[1], subject[2], subject[3], (function hasPrer() {
                                    if (subject.length > 4) {
                                        let prer = [...subject[4]]
                                        // se quitan los prerrequisitos que no estan en la malla
                                        prer.forEach(prer => {
                                            if (!subjectsList.has(prer))
                                                subject[4].splice(subject[4].indexOf(prer),1)
                                        })
                                        return subject[4];
                                    }
                                    return [];
                                })(), this.SUBJECTID++, this);
                            }
                        return
                        }
                    }
                })

                // Si existe una edicion o no estaba en la malla oficial
                if (this.customSubjects){
                    if (this.customSubjects[sigla] !== undefined) {
                        let data = this.customSubjects[sigla]
                        categoriesToUse.add(data[2])
                        let prer = [...data[3]]
                        prer.forEach(prer => {
                            if (!subjectsList.has(prer))
                                data[3].splice(data[3].indexOf(prer), 1)
                        })
                        this.malla[semester][sigla] = new this.subjectType(data[0], sigla, data[1], data[2], data[3],
                            this.SUBJECTID++, this, data[4], false, data[5])
                    }
                    totalCredits += this.malla[semester][sigla].getDisplayCredits()
                    this.addSubject(this.malla[semester][sigla])
                }
            })
        })
        this.totalCredits = totalCredits
        this.categories = {}
        let categories
        if (this.customSectors)
            categories = this.customSectors
        else
            categories = sectors

        categoriesToUse = [...categoriesToUse]
        categoriesToUse.forEach(category => {
            this.categories[category] = categories[category]
        })

        this.isMallaSet = true;
    }
}
