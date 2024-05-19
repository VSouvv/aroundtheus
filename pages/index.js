import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago Di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

/* --------------------------------- Elements -------------------------------- */
const closeButtons = document.querySelectorAll(".modal__close-button");

/* --------------------------------- Profile -------------------------------- */
const profileEditBtn = document.querySelector("#profile-edit-btn");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileEditForm = document.forms["profile-form"];
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

/* --------------------------------- Places --------------------------------- */
const placesAddBtn = document.querySelector("#places-add-btn");
const placesAddModal = document.querySelector("#places-add-modal");
const placeTitleInput = document.querySelector("#place-title-input");
const placeUrlInput = document.querySelector("#place-url-input");
const placeAddForm = document.forms["add-place-form"];

/* ---------------------------------- Cards --------------------------------- */
const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

/* ------------------------------ Image Preview ----------------------------- */
const placesPreviewModal = document.querySelector("#places-preview-modal");
const placesPreviewImage = document.querySelector("#places-preview");
const placesPreviewCaption = document.querySelector("#modal-image-caption");

/* --------------------------------- Functions -------------------------------- */

function openModal(modal) {
  modal.classList.add("modal_open");
  document.addEventListener("keydown", closeModalEsc);
  modal.addEventListener("mousedown", closeModalOverlay);
}

function fillProfileForm() {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
}

function closeModal(modal) {
  modal.classList.remove("modal_open");
  document.removeEventListener("keydown", closeModalEsc);
  modal.removeEventListener("mousedown", closeModalOverlay);
}

closeButtons.forEach((btn) => {
  const modal = btn.closest(".modal");
  btn.addEventListener("click", () => closeModal(modal));
});

function closeModalEsc(e) {
  if (e.key === "Escape") {
    const modalOpened = document.querySelector(".modal_open");
    closeModal(modalOpened);
  }
}

function closeModalOverlay(e) {
  if (e.target === e.currentTarget) {
    closeModal(e.currentTarget);
  }
}
/* --------------------------------- Reset Form ------------------------------ */
function resetForm(form) {
  form.reset();
}

/* -------------------- Edit Profile Handler & Listener --------------------- */
function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

/* ------------------------- Submit Button Listener ------------------------ */
placesAddBtn.addEventListener("click", () => {
  openModal(placesAddModal);
});

placeAddForm.addEventListener("submit", handleNewPlaceSubmit);

/* ------------------------- Image preview function ----------------------- */
function handleImageClick(cardData) {
  placesPreviewImage.src = cardData.link;
  placesPreviewImage.alt = "Photo of " + cardData.name;
  placesPreviewCaption.textContent = cardData.name;
  openModal(placesPreviewModal);
}

/* --------------------------- Initialize Cards -------------------------- */
initialCards.forEach((cardData) => {
  cardListEl.prepend(getCardElement(cardData));
});

function getCardElement(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  const cardElement = card.getView();
  return cardElement;
}

/* --------------------------- Form validation -------------------------- */
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__form-input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__save-button-disabled",
  inputErrorClass: "modal__form_input_type_error",
  errorClass: "modal__form-input-error-visible",
};

const profileEditValidation = new FormValidator(settings, profileEditForm);
const addPlaceValidation = new FormValidator(settings, placeAddForm);

/* ------------------------- Profile edit handler ------------------------ */
profileEditBtn.addEventListener("click", () => {
  profileEditValidation.resetValidation();
  fillProfileForm();
  openModal(profileEditModal);
});

function renderCard(cardData, wrapper) {
  wrapper.prepend(getCardElement(cardData));
}

/* ----------------------- Submit new place handler ---------------------- */
function handleNewPlaceSubmit(e) {
  e.preventDefault();
  const name = placeTitleInput.value;
  const link = placeUrlInput.value;
  renderCard({ name, link }, cardListEl);
  resetForm(placeAddForm);
  addPlaceValidation.disableButton();
  closeModal(placesAddModal);
}

profileEditValidation.enableValidation();
addPlaceValidation.enableValidation();
