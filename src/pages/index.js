import "./index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import { settings, elements } from "../utils/constants.js";
import Api from "../components/Api.js";

/* ---------- Utils Elements ------------ */
const {
  profileEditBtn,
  profileTitleInput,
  profileEditForm,
  profileDescriptionInput,
  placesAddBtn,
  placeAddForm,
  avatarUpdateBtn,
  avatarForm,
} = elements;

/* ---------- API Var ------------ */
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ca917973-003f-412f-833a-d01c5747f711",
    "content-type": "application/json",
  },
});

/* ---------- Image Click Preview Function ------------ */
function handleImageClick(imageData) {
  imagePreviewModal.open(imageData);
}

/* ---------- Validation ------------ */
const profileEditValidation = new FormValidator(settings, profileEditForm);
const addPlaceValidation = new FormValidator(settings, placeAddForm);
const avatarValidation = new FormValidator(settings, avatarForm);

/* ---------- Modals ------------ */
const editProfileModal = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
const addPlaceModal = new PopupWithForm(
  "#places-add-modal",
  handleNewPlaceSubmit
);
const updateAvatarModal = new PopupWithForm(
  "#avatar-update-modal",
  handleAvatarSubmit
);
const imagePreviewModal = new PopupWithImage("#places-preview-modal");
const deletePlaceModal = new PopupWithForm("#places-delete-modal", () => {});

/* ---------- Event Listeners ------------ */
editProfileModal.setEventListeners();
imagePreviewModal.setEventListeners();
updateAvatarModal.setEventListeners();
addPlaceModal.setEventListeners();

/* ---------- Form Validation ------------ */
deletePlaceModal.setEventListeners();
avatarValidation.enableValidation();
profileEditValidation.enableValidation();
addPlaceValidation.enableValidation();

/* ---------- Universal Submit Handler ------------ */
function handleSubmit(
  request,
  popupInstance,
  loadingText = "Saving...",
  defaultText = "Save",
  disableBtn = false
) {
  popupInstance.setLoading(true, loadingText);

  return request()
    .then(() => {
      popupInstance.close();
      popupInstance.reset();
      if (disableBtn) {
        popupInstance.setLoading(true);
      } else {
        popupInstance.setLoading(false);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      disableBtn = false;
    })
    .finally(() => {
      popupInstance.setLoading(disableBtn, defaultText);
    });
}

/* ---------- Delete Place Function ------------ */
function handleDeleteClick(cardID, cardElement) {
  deletePlaceModal.setSubmitHandler(() => {
    function makeRequest() {
      return api.removePlace(cardID).then(() => {
        cardElement.remove();
      });
    }

    handleSubmit(makeRequest, deletePlaceModal, "Removing...", "Yes", false);
  });

  deletePlaceModal.open();
}

/* ---------- Create Cards ------------ */
function getCardElement(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleDeleteClick,
    handleLikeReact
  );
  return card.getView();
}

/* ---------- Get Cards ------------ */
let section;
api
  .getInitialCards()
  .then((items) => {
    section = new Section(
      {
        items: items,
        renderer: (cardData) => {
          const cardElement = getCardElement(cardData);
          return cardElement;
        },
      },
      ".cards__list"
    );
    section.renderItems();
  })
  .catch((err) => console.error(err));

/* ---------- Get Profile ------------ */
const userInfo = new UserInfo(
  ".profile__title",
  ".profile__description",
  ".profile__image"
);

api
  .getUserInfo()
  .then((profileData) => {
    userInfo.setUserInfo(profileData);
  })
  .catch((err) => console.error(err));

/* ---------- Patch Profile Edit Function ------------ */
function handleProfileEditSubmit(profileInputValues) {
  function makeRequest() {
    return api
      .editUserInfo(profileInputValues.title, profileInputValues.description)
      .then((updatedUserData) => {
        userInfo.setUserInfo(updatedUserData);
      });
  }

  handleSubmit(makeRequest, editProfileModal, "Saving...", "Save", false);
}

/* ---------- Patch Profile Avatar Function ------------ */
function handleAvatarSubmit({ url }) {
  function makeRequest() {
    return api.updateAvatar(url).then(() => {
      userInfo.updateAvatar(url);
    });
  }

  handleSubmit(makeRequest, updateAvatarModal, "Saving...", "Save", true);
}

/* ---------- Post Add Place Function ------------ */
function handleNewPlaceSubmit(placeCardData) {
  function makeRequest() {
    const cardData = {
      name: placeCardData.title,
      link: placeCardData.url,
    };
    return api
      .addNewPlace(cardData.name, cardData.link)
      .then((newPlaceCard) => {
        const cardElement = getCardElement({
          name: newPlaceCard.name,
          link: newPlaceCard.link,
          _id: newPlaceCard._id,
        });
        section.addItem(cardElement);
      });
  }

  handleSubmit(makeRequest, addPlaceModal, "Saving...", "Save", true);
}

/* ---------- Put Add Like React ------------ */
function handleLikeReact(cardID, likeStatus) {
  if (likeStatus) {
    return api.removeLikeReact(cardID);
  } else {
    return api.addLikeReact(cardID);
  }
}

/* ---------- Edit Profile Button Listener ------------ */
profileEditBtn.addEventListener("click", () => {
  const { name, job } = userInfo.getUserInfo();
  profileTitleInput.value = name;
  profileDescriptionInput.value = job;
  editProfileModal.open();
  profileEditValidation.resetValidation();
});

/* ---------- Add Place Button Listener ------------ */
placesAddBtn.addEventListener("click", () => {
  addPlaceModal.open();
});

/* ---------- Profile Avatar Button Listener ------------ */
avatarUpdateBtn.addEventListener("click", () => {
  updateAvatarModal.open();
});
