import { urls } from "./http";

const list = document.getElementById("list");
const input = document.getElementById("input");
const textarea = document.getElementById("textarea");
const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const formData = {
      title: input.value,
      body: textarea.value,
      userId: 1,
    };
    // const formData = new FormData();
    // formData.append('title', input.value);
    // formData.append('body', textarea.value);
    // formData.append('userId', 1);

    const res = await fetch(urls.posts, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`Error code ${response.status}`);
      }
    });

    input.value = "";
    textarea.value = "";

    UIkit.notification({
      message: res,
      status: "success",
    });
  } catch (error) {
    UIkit.notification({ message: error, status: "danger" });
  }
});

const renderList = (data) => {
  data.map(({ id, title, body: text }) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<h2>${title}</h2><span>${text}</span>`;
    listItem.innerHTML += `<span> - ${id}</span>`;
    list.appendChild(listItem);
  });
};

const getData = async () => {
  try {
    const res = await fetch(urls.posts);
    const parsedRes = await res.json();
    UIkit.notification({
      message: "Data loaded successfuly",
      status: "success",
    });
    return parsedRes;
  } catch (error) {
    UIkit.notification({ message: error, status: "danger" });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const DATA = await getData();
  renderList(DATA || []);
});
