// ----------------- Selección de elementos -----------------
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventSubmit = document.querySelector(".add-event-btn");

// Inputs del formulario
const addEventObjetivo = document.querySelector(".event-objetivo");
const addEventMonto = document.querySelector(".event-monto");
const addEventEstado = document.querySelector(".event-estado");
const addEventFechaInicio = document.querySelector(".event-fecha-inicio");
const addEventFechaLimite = document.querySelector(".event-fecha-limite");

// ----------------- Variables del calendario -----------------
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// Eventos guardados
let eventsArr = JSON.parse(localStorage.getItem("eventsArr")) || [];

// ----------------- Inicializar calendario -----------------
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  // Días del mes anterior
  for(let x=day; x>0; x--) days += `<div class="day prev-date">${prevDays - x + 1}</div>`;

  // Días del mes actual
  for(let i=1; i<=lastDate; i++){
    let hasEvent = eventsArr.some(ev => ev.day===i && ev.month===month+1 && ev.year===year);
    let classes = hasEvent ? "event" : "";
    if(i === today.getDate() && month===today.getMonth() && year===today.getFullYear()){
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      classes += " today active";
    }
    days += `<div class="day ${classes}">${i}</div>`;
  }

  // Días del siguiente mes
  for(let j=1; j<=nextDays; j++) days += `<div class="day next-date">${j}</div>`;

  daysContainer.innerHTML = days;
  addDayListeners();
}

// ----------------- Navegación de meses -----------------
prev.addEventListener("click", () => { month--; if(month<0){month=11; year--} initCalendar(); });
next.addEventListener("click", () => { month++; if(month>11){month=0; year++} initCalendar(); });
todayBtn.addEventListener("click", () => { today=new Date(); month=today.getMonth(); year=today.getFullYear(); initCalendar(); });

// ----------------- Día activo -----------------
function addDayListeners(){
  const days = document.querySelectorAll(".day");
  days.forEach(day => {
    day.addEventListener("click", (e)=>{
      const selectedDay = Number(e.target.innerHTML);
      activeDay = selectedDay;
      getActiveDay(selectedDay);
      updateEvents(selectedDay);

      days.forEach(d=>d.classList.remove("active"));
      e.target.classList.add("active");

      if(e.target.classList.contains("prev-date")) { prev.click(); setTimeout(()=>{selectDay(selectedDay)},100); }
      if(e.target.classList.contains("next-date")) { next.click(); setTimeout(()=>{selectDay(selectedDay)},100); }
    });
  });
}

function selectDay(dayNum){
  const days = document.querySelectorAll(".day");
  days.forEach(d=>{if(d.innerHTML==dayNum && !d.classList.contains("prev-date") && !d.classList.contains("next-date")) d.classList.add("active");});
}

// ----------------- Mostrar día activo -----------------
function getActiveDay(day){
  const d = new Date(year, month, day);
  const dayName = d.toLocaleDateString("es-ES",{weekday:"long"});
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${day} ${months[month]} ${year}`;
}

// ----------------- Mostrar eventos -----------------
function updateEvents(day){
  eventsContainer.innerHTML = "";
  const dayEvents = eventsArr.filter(ev=>ev.day===day && ev.month===month+1 && ev.year===year);
  const activeDayEl = document.querySelector(".day.active");
  if(activeDayEl){
    if(dayEvents.length>0) activeDayEl.classList.add("event");
    else activeDayEl.classList.remove("event");
  }

  if(dayEvents.length===0){
    eventsContainer.innerHTML = `<div class="no-event"><h3>No hay eventos</h3></div>`;
  } else {
    dayEvents.forEach(ev=>{
      const evDiv = document.createElement("div");
      evDiv.classList.add("event");
      evDiv.innerHTML = `
        <h4>${ev.objetivo}</h4>
        <p>Monto: ${ev.monto}</p>
        <p>Estado: ${ev.estado}</p>
        <p>Inicio: ${ev.fechaInicio}</p>
        <p>Límite: ${ev.fechaLimite}</p>
        <button class="delete-event">Eliminar</button>
      `;
      eventsContainer.appendChild(evDiv);

      evDiv.querySelector(".delete-event").addEventListener("click", ()=>{
        if(confirm("Eliminar este evento?")){
          eventsArr = eventsArr.filter(e=>!(e.objetivo===ev.objetivo && e.day===ev.day && e.month===ev.month && e.year===ev.year));
          saveEvents();
          updateEvents(day);
          initCalendar();
        }
      });
    });
  }
}

// ----------------- Abrir / cerrar formulario -----------------
addEventBtn.addEventListener("click", ()=> addEventWrapper.classList.toggle("active"));
addEventCloseBtn.addEventListener("click", ()=> addEventWrapper.classList.remove("active"));

// ----------------- Crear nuevo evento -----------------
addEventSubmit.addEventListener("click", ()=>{
  const objetivo = addEventObjetivo.value.trim();
  const monto = addEventMonto.value.trim();
  const estado = addEventEstado.value;
  const fechaInicio = addEventFechaInicio.value;
  const fechaLimite = addEventFechaLimite.value;

  if(!objetivo || !fechaInicio){
    alert("Completa al menos objetivo y fecha de inicio");
    return;
  }

  const newEvent = {
    objetivo, monto, estado, fechaInicio, fechaLimite,
    day: activeDay, month: month+1, year
  };

  eventsArr.push(newEvent);
  saveEvents();
  updateEvents(activeDay);
  initCalendar();

  // Limpiar formulario
  addEventObjetivo.value = "";
  addEventMonto.value = "";
  addEventFechaInicio.value = "";
  addEventFechaLimite.value = "";
  addEventWrapper.classList.remove("active");
});

// ----------------- Guardar / cargar eventos -----------------
function saveEvents(){ localStorage.setItem("eventsArr", JSON.stringify(eventsArr)); }

// ----------------- Inicializar -----------------
initCalendar();
