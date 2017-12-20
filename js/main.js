// project Array
var storedProjectList;
var mde;

function main() {

	mde = new SimpleMDE({
		element: projectContent,
		autofocus: true,
		status: false,
		// toolbar: true,
		toolbarTips: true,
		toolbar: ["bold", "italic", "heading", "|", "quote"],
		// initialValue: project.projectContent
	});

	if (load()) {
		displayProjectList();
	}
	else {
		storedProjectList = [];
	}
}

function save() {
	localStorage["projectList"] = JSON.stringify(storedProjectList);
  console.log('storedProjectList Updated')
}

function load() {
	if(!localStorage["projectList"])
	return false;
	// retrive Array
	storedProjectList = JSON.parse(localStorage["projectList"]);
		return true;
}

function displayProjectForm() {
  const projectForm = document.querySelector('.projectForm');
	const startSection = document.querySelector('.startSection');
  projectForm.classList.remove('hide');
  projectForm.classList.add('display');
  startSection.classList.add('hide');
	const projectsContainer = document.querySelector('.projectList');
	// projectsContainer.classList.add('hide');
}

function hideProjectForm() {
  const projectForm = document.querySelector('.projectForm');
  projectForm.classList.remove('display');
  projectForm.classList.add('hide');
}

function addNewProject() {
  event.preventDefault();
  const titleInput = document.querySelector('.titleInput');
  const briefInput = document.querySelector('.briefInput');
  const createdDate = moment().valueOf();
	// const createdDateFormatted =
  briefInput.innerText = briefInput.value;

  storedProjectList.unshift({
    projectTitle : titleInput.value,
    projectBrief : briefInput.value,
    dateCreated: createdDate
  });

  save();

  titleInput.value = "";
  briefInput.value = "";

  hideProjectForm()
  displayProjectList();

}

function displayProjectList() {
  const startSection = document.querySelector('.startSection');
  const projectsContainer = document.querySelector('.projectList');
  const cardTemplate = projectsContainer.querySelector('.projectCard');
  projectsContainer.classList.remove('hide');
  if (typeof storedProjectList !== 'undefined' && storedProjectList.length > 0) {
		startSection.classList.add('hide');
		startSection.classList.remove	('display');
    projectsContainer.innerHTML = '';

    storedProjectList.forEach(function(project, i) {
      const projectCard = cardTemplate.cloneNode(true);
      projectCard.classList.remove('hide');
      projectsContainer.appendChild(projectCard);
      // const cardTop = projectCard.querySelector('.cardTop');
      // const cardFoot = projectCard.querySelector('.cardFoot');
      const projectTitle = projectCard.querySelector('.projectTitle');
      const projectBrief = projectCard.querySelector('.projectBrief');
      const timeUpdate = projectCard.querySelector('.update');

			// Time Formate for cards
			const currentTime = moment(project.dateCreated).fromNow();

      projectTitle.innerText = project.projectTitle;
      projectBrief.innerText = project.projectBrief;
			timeUpdate.innerText = currentTime;


      // trigger "more" for each project
			const dropdownTrigger = projectCard.querySelector('.dropdown');
			const dropdownContent = projectCard.querySelector('.dropdown-content');
      dropdownTrigger.addEventListener("click", evt => openMoreOptions(evt, projectCard, dropdownTrigger, dropdownContent));


			// Delete from project list
			const deleteProjectBtn = projectCard.querySelector('.deleteAction');
			deleteProjectBtn.addEventListener("click", e => deleteProject(project));

			//Open the project Content
			projectCard.addEventListener("click", e => openProjectContent(e, project, projectCard, contentContainer));

    });
  } else {
    startSection.classList.remove('hide');
    startSection.classList.add('display');
		projectsContainer.classList.add('hide');
  }
}

function deleteProject(project) {
	const index = storedProjectList.indexOf(project);
	if (index < 0)
		return;
	storedProjectList.splice(index, 1);

	save();
	displayProjectList();

	console.log('lets dilly dally');
}

function openMoreOptions(e, projectCard, dropdownTrigger, dropdownContent) {
	dropdownTrigger.classList.toggle('triggered');
}

function closeMoreOptions(e) {
	let currentlyClickedDropdown = e.target.closest(".dropdown");

	document.querySelectorAll(".triggered").forEach(dropdownTrigger => {
		if (dropdownTrigger == currentlyClickedDropdown)
			return;
		dropdownTrigger.classList.remove('triggered');
	});

}

function openProjectContent(e, project, projectCard, dropdownTrigger) {

	if (e.target.closest('.dropdown') != null)
		return;

	const contentContainer = document.getElementById('contentContainer');
	// projectCard.appendChild(contentContainer);
	const contentTitle = contentContainer.querySelector('.contentTitle');
	const contentBrief = contentContainer.querySelector('.contentBrief');
	const projectContent = contentContainer.querySelector('.projectContent');

	// click tester
	// projectContent.addEventListener("keydown", e => saveProjectContent(project, projectCard, contentContainer));
	mde.codemirror.on("change", e => saveProjectContent(project));




	contentContainer.classList.add('opened');

	contentTitle.innerText = project.projectTitle;
	contentBrief.innerText = project.projectBrief;



	// var mde = new SimpleMDE({
	// 	element: projectContent,
	// 	status: false,
	// 	toolbar: false,
	// 	initialValue: project.projectContent
	// });
	// console.log({mde,mde2});

	if (project.projectContent == undefined)
		return;

	mde.value(project.projectContent);

	// projectContent.innerText = project.projectContent;
	// console.log(project.projectContent);

}

function saveProjectContent(project) {

	// projectContent.innerText = projectContent.value;
	//var value = mde.value();

	project.projectContent = mde.value();

	// var debounce = null;
	// clearTimeout(debounce);
  // debounce = setTimeout(function(){
	save();
	console.log(project.projectContent);

		// console.log('shit we are saving bitchesssss')
  // }, 10000);

}

main();


// Call the form from start page
const createLink = document.querySelector('.createLink');
createLink.addEventListener("click", e => displayProjectForm());

// Get input from the form field
const newprojectBtn = document.querySelector('.newprojectBtn');
newprojectBtn.addEventListener("click", e => addNewProject());

// Clost all dropdowns
document.addEventListener("click", evt => closeMoreOptions(evt));
