export default class UserInfo {
  constructor({ titleSelector, descriptionSelector }) {
    this._profileName = document.querySelector(titleSelector);
    this._profileJob = document.querySelector(descriptionSelector);
  }

  getUserInfo() {
    return {
      name: this._profileName.textContent,
      job: this._profileJob.textContent,
    };
  }

  setUserInfo({ title, description }) {
    this._profileName.textContent = title;
    this._profileJob.textContent = description;
  }
}
