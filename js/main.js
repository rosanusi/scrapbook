// project Array
var storedProjectList;
var mde;

function main() {

	mde = new SimpleMDE({
		element: projectContent,
		autofocus: false,
		status: false,
		toolbar: false,
		// toolbarTips: true,
		// toolbar: ["bold", "italic", "heading", "|", "quote"],
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

function displayProjectForm(projectsContainer) {
	event.preventDefault();
  const projectForm = document.querySelector('.projectForm');
	const startSection = document.querySelector('.startSection');
  projectForm.classList.remove('hide');
	startSection.classList.add('hide');
}

function hideProjectForm() {
  const projectForm = document.querySelector('.projectForm');
  projectForm.classList.add('hide');
}

function addNewProject() {

	event.preventDefault();

	const formWrap = document.querySelector('.projectForm-inner');
  const titleInput = document.querySelector('.titleInput');
  const briefInput = document.querySelector('.briefInput');
  const createdDate = moment().valueOf();

	// checkForm input is not empty before saving;
	const notification = document.querySelector('.notification');

	if (titleInput.value == "" || briefInput.value == "") {
		notification.classList.remove('hide');
		console.log(formWrap);
		console.log(notification);

	} else {

		briefInput.innerText = briefInput.value;
		storedProjectList.unshift({
	    projectTitle : titleInput.value,
	    projectBrief : briefInput.value,
	    dateCreated: createdDate
	  });

		save();
		titleInput.value = "";
		briefInput.value = "";
		notification.classList.add('hide');
	  hideProjectForm()
	  displayProjectList();
	}

}

function displayProjectList() {
  const mainHeader = document.querySelector('.mainHeader');
	const startSection = document.querySelector('.startSection');
  const projectsContainer = document.querySelector('.projectList');
  const cardTemplate = projectsContainer.querySelector('.projectCard');
  projectsContainer.classList.remove('hide');
  if (typeof storedProjectList !== 'undefined' && storedProjectList.length > 0) {
		startSection.classList.add('hide');
		mainHeader.classList.remove('hide');
    projectsContainer.innerHTML = '';

    storedProjectList.forEach(function(project, i) {
      const projectCard = cardTemplate.cloneNode(true);
      projectCard.classList.remove('hide');
      projectsContainer.appendChild(projectCard);
      const projectTitle = projectCard.querySelector('.projectTitle');
      const projectBrief = projectCard.querySelector('.projectBrief');
      const timeUpdate = projectCard.querySelector('.update');

			// Time Formate for cards
			const createdTime = moment(project.dateCreated).fromNow();

      projectTitle.innerText = project.projectTitle;
      projectBrief.innerText = project.projectBrief;
			timeUpdate.innerText = createdTime;


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
		mainHeader.classList.add('hide');
    startSection.classList.remove('hide');
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

function openProjectContent(e, project, projectsContainer, projectCard, dropdownTrigger) {
	if (e.target.closest('.dropdown') != null)
		return;

	const contentContainer = document.getElementById('contentContainer');
	const contentTitle = contentContainer.querySelector('.contentTitle');
	const contentBrief = contentContainer.querySelector('.contentBrief');
	const projectDateCreated = contentContainer.querySelector('.dateCreated');
	const createdTime = moment(project.dateCreated).fromNow();
	const closeProjectBtn = contentContainer.querySelector('.closeProjectBtn');
	const projectContent = contentContainer.querySelector('.projectContent');

	const saveHandler = e => saveProjectContent(project);
	mde.codemirror.on("change", saveHandler);
	//mde.codemirror.off("change", saveHandler);

	contentContainer.classList.add('opened');

	contentTitle.innerText = project.projectTitle;
	contentBrief.innerText = project.projectBrief;
	projectDateCreated.innerText = 'created ' + ' ' + createdTime;

	if (project.projectContent == undefined)
		return;

	mde.value(project.projectContent);

	closeProjectBtn.addEventListener("click", e => closeProjectContent(saveHandler));
}

function saveProjectContent(project) {
	console.log("editor changed", project);
	project.projectContent = mde.value();
	save();
}


function closeProjectContent(saveHandler) {

	mde.codemirror.off("change", saveHandler);
	contentContainer.classList.remove('opened');

	//mde.codemirror.on("change", e => saveProjectContent(project));

	console.log('function works');
}

// Call the form from start page
const createLink = document.querySelector('.createLink');
createLink.addEventListener("click", e => displayProjectForm());

// Call the form from the header page
const headerLink = document.querySelector('.headerLink');
headerLink.addEventListener("click", e => displayProjectForm());

// Get input from the form field
const newprojectBtn = document.querySelector('.newprojectBtn');
newprojectBtn.addEventListener("click", e => addNewProject());

// Close all dropdowns
document.addEventListener("click", evt => closeMoreOptions(evt));

document.addEventListener("DOMContentLoaded", function(){
	main();
});
