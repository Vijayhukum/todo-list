document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("addToDo");
  const inputField = document.getElementById("inputField");
  const toDoContainer = document.getElementById("toDoContainer");

  addButton.addEventListener("click", addItem);
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addItem();
  });

  function addItem() {
    const itemValue = inputField.value.trim();
    if (itemValue === "") {
      alert("You must write something");
      return;
    }

    const item = createItem(itemValue);
    toDoContainer.appendChild(item);

    inputField.value = ""; // Clear the input field
    saveData();
  }

  function createItem(value) {
    const item = document.createElement("div");
    item.classList.add("item");

    const itemContent = document.createElement("div");
    itemContent.classList.add("content");
    item.appendChild(itemContent);

    const checkbox = createCheckbox();
    itemContent.appendChild(checkbox);

    const inputItem = createInput(value);
    itemContent.appendChild(inputItem);

    const actions = document.createElement("div");
    actions.classList.add("actions");
    item.appendChild(actions);

    const editButton = createButton("Edit", "edit", "btn-success", function () {
      handleEdit(editButton, inputItem);
    });
    const deleteButton = createButton(
      "Delete",
      "delete",
      "btn-danger",
      function () {
        handleDelete(item);
      }
    );

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    return item;
  }

  function createCheckbox() {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");

    checkbox.addEventListener("change", function () {
      const item = checkbox.closest(".item");
      const inputItem = item.querySelector(".text");
      inputItem.style.textDecoration = checkbox.checked
        ? "line-through"
        : "none";
      saveData();
    });

    return checkbox;
  }
  function createCheckbox() {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");

    checkbox.addEventListener("change", function () {
      const item = checkbox.parentElement.parentElement; // Traverse up the DOM to the .item
      const inputItem = item.querySelector(".text");
      inputItem.style.textDecoration = checkbox.checked
        ? "line-through"
        : "none";
      saveData();
    });

    return checkbox;
  }

  function createInput(value) {
    const inputItem = document.createElement("input");
    inputItem.classList.add("text");
    inputItem.type = "text";
    inputItem.value = value;
    inputItem.setAttribute("readonly", "readonly");
    return inputItem;
  }

  function createButton(text, className, btnClass, clickHandler) {
    const button = document.createElement("button");
    button.classList.add(className, "btn", btnClass);
    button.type = "button";
    button.innerText = text;
    button.addEventListener("click", clickHandler);
    return button;
  }

  function handleEdit(editButton, inputItem) {
    if (editButton.innerText.toLowerCase() === "edit") {
      editButton.innerText = "Save";
      inputItem.removeAttribute("readonly");
      inputItem.focus();
    } else {
      editButton.innerText = "Edit";
      inputItem.setAttribute("readonly", "readonly");
      saveData();
    }
  }

  function handleDelete(item) {
    toDoContainer.removeChild(item);
    saveData();
  }

  //  save Data to local storage

  function saveData() {
    const taskData = [];

    document.querySelectorAll(".item").forEach((item) => {
      const checkbox = item.querySelector("input[type='checkbox']");
      const inputItem = item.querySelector("input[type='text']");

      // Add the item's data to the taskData array
      taskData.push({ isChecked: checkbox.checked, value: inputItem.value });
    });

    // Save the taskData to local storage
    localStorage.setItem("taskData", JSON.stringify(taskData));
  }

  function showTask() {
    const savedTaskData = localStorage.getItem("taskData");

    if (savedTaskData) {
      const taskData = JSON.parse(savedTaskData);

      // Iterate through each task data
      taskData.forEach((data) => {
        // Create a new to-do item using the task value
        const item = createItem(data.value);

        // Find the checkbox and text input inside the new to-do item
        const checkbox = item.querySelector(".checkbox");
        const inputItem = item.querySelector(".text");

        // Set the checkbox state and text decoration based on saved data
        checkbox.checked = data.isChecked;
        inputItem.style.textDecoration = checkbox.checked
          ? "line-through"
          : "none";

        // Append the new to-do item to the to-do container
        toDoContainer.appendChild(item);
      });
    }
  }

  showTask();
});
