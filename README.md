# Malla interactiva — Ingeniería Comercial UDP

Esta es una adaptación del proyecto de [Malla Interactiva de César Paulangelo (@BooterMan98)](https://github.com/BooterMan98/malla-interactiva), que a su vez reconoce la malla original de [Sebastián Aedo (@etra0)](https://github.com/etra0/ramos). Esta versión contiene las menciones de **Administración** y **Economía** de Ingeniería Comercial de la Universidad Diego Portales.

![Último commit](https://img.shields.io/github/last-commit/cocobasualto/malla-interactiva-ICO-UDP)
![Licencia](https://img.shields.io/github/license/cocobasualto/malla-interactiva-ICO-UDP)

## Empezar aquí

### 1. Abrir una malla

No necesitas instalar nada para usar la versión publicada:

- **[Ingeniería Comercial — Mención Administración](https://cocobasualto.github.io/malla-interactiva-ICO-UDP/?m=administracion)**
- **[Ingeniería Comercial — Mención Economía](https://cocobasualto.github.io/malla-interactiva-ICO-UDP/?m=economia)**

También puedes cambiar de mención desde el menú **Carreras** de la página.

### 2. Usar las funciones principales

1. Haz clic en un ramo para marcarlo como aprobado; vuelve a hacer clic para cambiar su estado.
2. Al marcar los ramos aprobados, la malla refleja el avance y permite identificar cuáles asignaturas se liberan según sus prerrequisitos.
3. Revisa los créditos y porcentajes de avance que aparecen bajo la malla. Usa **Limpiar ramos aprobados** para reiniciar el progreso.
4. Consulta la leyenda de colores para identificar las categorías de ramos.
5. Entra a la **[Calculadora de prioridad](https://cocobasualto.github.io/malla-interactiva-ICO-UDP/prioridad/?m=administracion)** o a la **[Generadora de mallas](https://cocobasualto.github.io/malla-interactiva-ICO-UDP/personalizar/?m=administracion)** desde el menú superior. Estas herramientas también pueden abrirse para la mención de Economía cambiando el parámetro de carrera a administracion o economia.

El progreso guardado en el navegador se conserva en ese navegador y dispositivo. No se sincroniza automáticamente con otros dispositivos. Si borras los datos del sitio o cambias de navegador, podrías perder ese progreso.

### 3. Ejecutar el proyecto en tu computador

**Requisitos:** Git y Python 3. Con esto puedes probar la página sin compilar el JavaScript.

1. Clona el repositorio y entra a la carpeta:

        git clone https://github.com/cocobasualto/malla-interactiva-ICO-UDP.git
        cd malla-interactiva-ICO-UDP

2. Inicia un servidor local desde la carpeta raíz:

        python -m http.server 8000

3. Abre una de estas direcciones:

   - http://localhost:8000/index.html?m=administracion
   - http://localhost:8000/index.html?m=economia

Deja abierta la terminal mientras pruebas la página. Para detener el servidor, vuelve a la terminal y presiona **Ctrl + C**. No abras solamente el archivo HTML con doble clic: el proyecto necesita un servidor HTTP para cargar los JSON y las vistas correctamente.

**Si vas a modificar archivos JavaScript**, instala las dependencias y regenera los bundles antes de probar:

    npm install
    npm run devBuild
    npm start

Estos comandos deben ejecutarse en la carpeta raíz. **npm start** inicia BrowserSync para servir la página y observar cambios. En Windows, usa una terminal compatible con los scripts Bash del proyecto, como Git Bash. Si solo editas JSON, no necesitas regenerar el JavaScript.

### 4. Editar las menciones y los ramos

Los archivos curriculares están en la carpeta **data/**:

| Archivo | Para qué sirve |
|---|---|
| **data/carreras.json** | Define los nombres e identificadores de las menciones que aparecen en el menú. |
| **data/data_administracion.json** | Contiene los ramos por semestre de Administración. |
| **data/colors_administracion.json** | Define los colores y nombres de categorías de Administración. |
| **data/data_economia.json** | Contiene los ramos por semestre de Economía. |
| **data/colors_economia.json** | Define los colores y nombres de categorías de Economía. |

**Para agregar o renombrar una mención**, mantén sincronizado el campo **Link** de **data/carreras.json** con los nombres de los archivos. Por ejemplo, si el identificador es **administracion**, el motor busca **data/data_administracion.json** y **data/colors_administracion.json**. Respeta exactamente las mayúsculas y minúsculas.

Cada ramo debe seguir el formato de siete campos que utiliza el motor de la malla:

    [
      "Nombre del ramo",
      "SIGLA-101",
      6,
      6,
      "MET",
      ["SIGLA-100"],
      "A"
    ]

Los campos son: nombre, sigla única, créditos del primer campo, créditos del segundo campo, categoría, lista de siglas de prerrequisitos e indicador de semestre (**P**, **I** o **A**). Coloca cada ramo dentro del semestre correspondiente, por ejemplo **s1**, **s2**, etc. Las categorías usadas en el quinto campo deben existir en el archivo de colores, con un formato como **"MET": ["#FF3333", "Métodos Cuantitativos"]**.

Antes de publicar cambios curriculares, revisa que cada sigla sea única, que los prerrequisitos existan y correspondan a semestres anteriores, que todas las categorías tengan color y que los créditos coincidan con el plan oficial de la UDP. El motor proviene de un proyecto originalmente desarrollado para otra universidad y conserva algunos nombres de campos y textos relacionados con créditos; verifica esos rótulos antes de presentar la aplicación como una fuente oficial de créditos UDP.

### 5. Publicar los cambios

1. Prueba localmente la malla después de editar los datos.
2. Guarda los cambios en Git y súbelos a la rama que publica el sitio. Por ejemplo:

        git add .
        git commit -m "Describe tus cambios"
        git push origin master

3. GitHub Pages debe estar configurado para publicar desde la rama y carpeta correctas del repositorio. Una vez que termine la publicación, actualiza la página con una recarga forzada (**Ctrl + Shift + R**) si sigues viendo una versión antigua.

No elimines **js/min1.js**, **js/min2.js**, **js/min3.js** ni **js/min4.js**: las distintas páginas utilizan esos archivos para cargar sus funciones. Si modificas los archivos fuente JavaScript, vuelve a ejecutar **npm run devBuild** y comprueba que el sitio cargue antes de publicar.

## Índice

- [Características de la malla](#características-de-la-malla)
- [Cómo funciona el formato de datos](#cómo-funciona-la-malla)
- [Agregar o cambiar una malla](#agregar-o-cambiar-una-malla)
- [Probar malla](#probar-malla)
- [Agradecimientos y créditos](#agradecimientos-y-créditos)

# Características de la malla
- Visualiza los créditos de las asignaturas según el sistema **USM** o **SCT** 
- Selecciona asignaturas para aprobarlas, a medida que vayas aprobando más ramos, podrás ver que ramos
  se desbloquean.
- Calcula tu prioridad. Puedes calcularla basado en ambos sistemas de créditos.  
    ![Gif demo de calculo de prioridad](https://media.giphy.com/media/9FZo5ua3aCmXij4xZ5/giphy.gif)
- Crear una malla personal que se adecue a tu desdicha recorrida en la Universidad.
    ![Gif demo de la malla personalidada](https://media.giphy.com/media/QK448lB7juUF0ftL7g/giphy.gif)
    - Agregar y cambiar los pre-requisitos de los ramos, incluyendo los ya existentes!
    - Agregar ramos que no se encuentren en la malla oficial pero que hayas cursado.
- Cualquier cambio realizado queda guardado para la próxima visita a la página
- Modo oscuro y modo claro automático basado en la configuración del SO o explorador

# TODO
* [ ] Arreglar bugs
* [X] Hacer página más usable en móviles
    * [X] Prioridad
    * [X] Malla personal
    * [X] Malla interactiva
* [ ] Facilitar creación y modificación de mallas oficiales
    * [ ] Crear forma rápida para cambiar solo un ramo
* [ ] Hacer un mejor uso de las características de github
    * [ ] Definir Miletones importantes
    * [ ] Crear pruebas y automatizarlas con github actions
    * [ ] Hacer uso de tags (tal vez)



## ¿Cómo funciona la malla?

Cada malla necesita de dos archivos `.json` para que esta se muestre en el sitio. Estos tienen por nombre
`data_CARR.json` y `colors_CARR.json` y se ubican en el directorio `/data`. `CARR` corresponde a la abrebiatura de la carrera (por Ej: INF para informática) El primero (`data_CARR.json`) contiene
la información de cada ramo y sus características agrupados por semestre. Se sigue la siguiente estructura:  
```json5
{
  "s2": [
    ["Química y Sociedad","QUI-010",3,5,"PC",[],"A"],
    ["Matemáticas II","MAT-022",5,7,"PC",["MAT-021"],"A"],
    ["Física General I","FIS-110",5,8,"PC",["MAT-021","FIS-100"],"A"],
    ["Introducción a la Ingeniería","IWG-101",2,3,"TIN",[],"A"],
    ["Humanístico II","HRW-133",2,3,"HUM",[],"A"],
    ["Educación Física II","DEW-101",1,0,"HUM",["DEW-100"],"A"]
  ],
//  ...
}
```
En donde  
`s2` Corresponde al semestre, en este caso, Semestre II. `s2` contiene una lista de ramos, donde cada ramo tiene 7 items en el siguiente orden:
1. ***Ramo***: El nombre completo del ramo.
2. ***Sigla***: Sigla del ramo. **Única** para cada ramo, no se puede repetir y no puede contener espacios. Se pide seguir el formato `sigla-número`
3. ***Créditos USM***: Entero, la cantidad de créditos USM.
4. ***Créditos SCT***: Entero, la cantidad de créditos SCT. Si su valor es `0`, se calcula
   basándose en los créditos USM
5. ***Categoría***: Categoría del ramo al que pertenece (por ejemplo, *PC*: Plan Común), se deben agregar ó editar en el json `colors_CARR.json`.
6. ***Prerrequisitos***: Una lista de strings que contiene las siglas de los prerrequisitos del ramo. **Es importante
   que la sigla ya exista en semestres anteriores**, de lo contrario podría fallar. Esta lista es opcional.
7. ***Indicador Par o Impar***: Puede tener el valor de `"P"`, `"I"`, `"A"` o `""`. Indica
   si el ramo se dicta en un semestre **P**ar, **I**mpar, o en **A**mbos. `""` Actúa como `"A"` pero significa que no se sabe, por favor evitar dejarlo en blanco.
   
El segundo archivo corresponde a `colors_CARR.json`. Este contiene las categorías y los colores de la malla y sigue el siguiente formato:

```json5
{
  "Abreviación": ["Color", "Categoría"],
//  ...
}
```
Para elegir un buen color, puedes buscar Color Picker en [Google](https://www.google.com/search?client=safari&rls=en&q=Color+Picker&ie=UTF-8&oe=UTF-8)  
Ejemplo:

```json5
{
  "PC": ["#00838F", "Plan Común"]
}
```

Si aun hay dudas, puede revisar [data_INF.json](https://github.com/CsarMan/malla-interactiva/blob/master/data/data_INF.json)
y [colors_INF.json](https://github.com/CsarMan/malla-interactiva/blob/master/data/colors_INF.json)

## Agregar o cambiar una malla

Hay varias formas de agregar o cambiar una malla. La más directa es editar o crear directamente los archivos usando el
formato ya explicado, y realizar una pull request con los archivos en directorio correcto.
Otra forma consiste en crear o editar una malla con la [generadora de mallas](https://csarman.github.io/malla-interactiva/personalizar/) (tiene instrucciones **:p**) y contestar este
[formulario](https://docs.google.com/forms/d/e/1FAIpQLSc7im-tmzXlWhHYb5XmRhIMGTLQ5GUZj4haRq8iSECYsuXU8A/viewform?usp=sf_link) con la malla generada.
Por último, usar la malla generada en una pull request

*Nota*: Es recomendable (por no decir necesario) hacer el proceso en un computador.


## Probar malla
Para probar la malla, existen los siguientes métodos:

**NOTA:** Independientemente de la forma en que se prueba la malla, en caso de editar archivos `.js`, para que estos se reflejen, ejecute desde una terminal en la carpeta raíz
```shell
npm run devBuild
```

### Usando Python (preferido)
Lo ideal sería probarlo usando python, ya que permite levantar un mini servidor http lo que facilita la carga
para el navegador. Para esto, se tiene que **abrir una terminal, ir al directorio principal de la malla** y ejecutar lo siguiente:

* Si tiene **Python 2** (el usado en la universidad hasta hace poco):
    ```shell
    python -m SimpleHTTPServer
    ```
* Si tiene **Python 3** (el actual):
    ```shell
    python -m http.server
    ```

Independiente de la version, una vez ejecutado la línea, después se debe abrir un navegador
e ir a la dirección http://localhost:8000 y ahí debería ver la malla.
Dependiendo de la malla a probar, deberá navegar agregando al final de la url `?m=CARR`. Por ejemplo,
para abrir `data_INF.json` debería quedar algo como `http://localhost:8000/index.html?m=INF`.



### Usando Docker
Los únicos requisitos son el tener `docker`, `podman` o cualquier otro _container manager_.

Primero clone el repo y construya la imagen mediante:
```shell
docker build -t malla-interactiva .
```

dentro del mismo directorio del repositorio.

* **Para correr la imagen** ejecute:
    ```shell
    docker run -d -p 8080:8080 --name mallas malla-interactiva
    ```
    Y listo! Con esto podrá visitar la malla utilizando la dirección [http://localhost:8080/](http://localhost:8080/).

* **Para detener y eliminarla** la instancia del container al mismo tiempo ejecute:

    ```shell
    docker rm --force mallas
    ```
* **Para solo detener** la instancia
    ```shell
    docker stop mallas
    ```



### Usando Firefox
Se tiene que abrir el `index.html` con **Firefox** (debido a que los otros navegadores tienen
desactivada la lectura de archivos locales por defecto), y al final de la URL agregar `?m=CARR`. Por ejemplo,
para abrir `data_INF.json` debería quedar algo como `index.html?m=INF`.



### Usando Browser-sync
Con *NPM* instalado en el equipo, ejecute desde una terminal en la carpeta raíz de el repo
```shell
npm install
npx browser-sync -w
```
o simplemente (hay una diferencia entre ambos)
```shell
npx browser-sync -w
```
Ejecutado lo anterior, se tendrá en su explorador favorito una
versión local de la página. La dirección por defecto es `http://localhost:3000`

Si su explorador tiene problemas, abra *Firefox* y copie y pegue la dirección de la página.


---
# Agradecimientos y créditos

## Proyecto original

Esta adaptación se basa en el trabajo previo de la comunidad de la malla interactiva:

* **[Sebastián Aedo (@etra0)](https://github.com/etra0)**, creador de la malla interactiva original: [repositorio original](https://github.com/etra0/ramos).
* **[César Paulangelo (@BooterMan98)](https://github.com/BooterMan98)**, autor y mantenedor del proyecto base del que parte este fork: [malla-interactiva](https://github.com/BooterMan98/malla-interactiva).

## Créditos de esta adaptación para Ingeniería Comercial UDP

* **Crescente Basualto** — adaptación y configuración de este fork para las menciones de Administración y Economía de Ingeniería Comercial de la Universidad Diego Portales.
* **ChatGPT (OpenAI)** — apoyo de inteligencia artificial para depurar errores de JavaScript, revisar la estructura de los datos, solucionar problemas de configuración y documentar los cambios. Se reconoce como asistencia técnica, no como autoría del proyecto.

## Agradecimientos a colaboradores del proyecto base

* [Pablo Aravena](https://github.com/litneet64), por su ayuda en la integración del proyecto con Labcomp y en el build workflow.
* [Carlos Ponce](https://github.com/capgadsx), por su ayuda en la integración del proyecto con Labcomp.

También se agradece a quienes han contribuido al proyecto base:
<a href="https://github.com/csarman/malla-interactiva/graphs/contributors">
<img src="https://contrib.rocks/image?repo=csarman/malla-interactiva" alt="Contribuidores del proyecto base" />
</a>
