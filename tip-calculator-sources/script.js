// Déclaration des variables
let selectedPercentage = undefined;
const active = document.querySelector(".selected");
const tipPerPerson = document.querySelector(".tip-amount-value");
const totalBillPerPerson = document.querySelector(".val");
const billInput = document.getElementById("bill");
const warningBill = document.querySelector(".erreur");
const percentages = document.querySelectorAll(".percentage-btn");
const customInput = document.getElementById("custom-percentage");
const peopleInput = document.getElementById("number");
const warningPeople = document.querySelector(".warning-people");
const reset = document.querySelector(".reset");
reset.disabled = true;

// Gestion de l'input pour le montant de la facture
billInput.addEventListener("input", handleBillInput);

// Gestion des boutons de pourcentage
percentages.forEach(percentage => percentage.addEventListener("click", handlePercentageClick));

// Gestion de l'input pour un pourcentage personnalisé
customInput.addEventListener("input", handleCustomInput);
customInput.addEventListener("keydown", handleCustomInputEnter);

// Gestion de l'input pour le nombre de personnes
peopleInput.addEventListener("input", handlePeopleInput);

// Gestion du bouton de réinitialisation
reset.addEventListener("click", handleReset);

// Fonction pour gérer l'input du montant de la facture
function handleBillInput() {
    const value = Number(billInput.value.trim());
    reset.disabled = false;
    reset.classList.add("reset-active");
    if (value === 0 || value < 0 || value === "") {
        warning(warningBill, billInput);
    } else {
        allClear(warningBill, billInput);
    }
    validateDecimalPlaces(billInput);
}

// Fonction pour gérer le clic sur un bouton de pourcentage
function handlePercentageClick(e) {
    selectedPercentage = parseFloat(e.target.getAttribute("percentage")); // Convertir en nombre décimal
    reset.disabled = false;
    reset.classList.add("reset-active");
    percentages.forEach(btn => {
        btn.classList.remove("selected");
        if (btn === e.target) {
            btn.classList.add("selected");
        }
    });
    calculate(selectedPercentage);
}

// Fonction pour gérer l'input pour un pourcentage personnalisé
function handleCustomInput() {
    const value = Number(customInput.value.trim());
    reset.disabled = false;
    reset.classList.add("reset-active");
    if (value === 0 || value < 0 || value > 99) {
        redOutline(customInput);
    } else {
        defaultOutline(customInput);
        calculate(value * 0.01);
    }
    // Désélectionner tous les boutons de pourcentage
    percentages.forEach(btn => btn.classList.remove("selected"));
    validateDecimalPlaces(customInput);
}

// Fonction pour gérer l'entrée lors de la saisie d'un pourcentage personnalisé
function handleCustomInputEnter(event) {
    if (event.key === "Enter") {
        const value = Number(customInput.value.trim());
        reset.disabled = false;
        if (value === 0 || value === "" || value > 99) {
            redOutline(customInput);
        } else {
            defaultOutline(customInput);
            calculate(value * 0.01);
        }
    }
}

// Gestion de l'input pour le nombre de personnes
peopleInput.addEventListener("input", handlePeopleInput);

// Fonction pour gérer l'input pour le nombre de personnes
function handlePeopleInput() {
    reset.disabled = false;
    reset.classList.add("reset-active");
    const value = Number(peopleInput.value.trim());
    if (value < 0 || value === "" || value % 1 !== 0) {
        warning(warningPeople, peopleInput);
        totalBillPerPerson.textContent = "0.00"; // Réinitialiser la valeur si elle est invalide
        tipPerPerson.textContent = "0.00"; // Réinitialiser la valeur si elle est invalide
    } else {
        allClear(warningPeople, peopleInput);
        calculate(selectedPercentage); // Appel de la fonction de calcul pour mettre à jour les valeurs
    }
}

// Fonction pour gérer le clic sur le bouton de réinitialisation
function handleReset() {
    reset.classList.remove("reset-active");
    totalBillPerPerson.textContent = "0.00";
    tipPerPerson.textContent = "0.00";
    billInput.value = "";
    peopleInput.value = "";
    customInput.value = "";
    warningBill.style.opacity = "0";
    warningPeople.style.opacity = "0";
    removeStyles(billInput);
    removeStyles(customInput);
    removeStyles(peopleInput);
    selectedNumber = undefined;
    percentages.forEach(btn => btn.classList.remove("selected"));
}

// Fonction pour effectuer le calcul
function calculate(percentage) {
    const billValue = parseFloat(billInput.value.trim());
    const peopleValue = Number(peopleInput.value.trim());

    // Vérifier si les valeurs sont négatives
    if (billValue <= 0 || peopleValue <= 0 || isNaN(billValue) || isNaN(peopleValue)) {
        totalBillPerPerson.textContent = "0.00"; // Réinitialiser les valeurs
        tipPerPerson.textContent = "0.00"; // Réinitialiser les valeurs
        return; // Arrêter l'exécution de la fonction si les valeurs sont négatives
    }

    const personalBill = billValue / Math.trunc(peopleValue);
    const personalTip = personalBill * percentage;
    const personalBillAndTip = personalBill + personalTip;
    totalBillPerPerson.textContent = personalBillAndTip.toFixed(2);
    tipPerPerson.textContent = personalTip.toFixed(2);
}

// Fonction pour valider le nombre de décimales
function validateDecimalPlaces(element) {
    const inputValue = element.value;
    const decimalIndex = inputValue.indexOf('.');
    const decimals = inputValue.substring(decimalIndex + 1);
    if (inputValue.includes(".") && decimals.length > 2) {
        redOutline(element);
    }
}

// Fonction pour afficher un avertissement
function warning(warning, element) {
    warning.style.opacity = "1";
    redOutline(element);
}

// Fonction pour effacer l'avertissement
function allClear(warning, element) {
    warning.style.opacity = "0";
    defaultOutline(element);
}

// Fonction pour ajouter un contour rouge
function redOutline(element) {
    element.classList.add("warning");
    element.classList.remove("default");
}

// Fonction pour ajouter un contour par défaut
function defaultOutline(element) {
    element.classList.add("default");
    element.classList.remove("warning");
}

// Fonction pour supprimer les styles
function removeStyles(element) {
    element.classList.remove("default");
    element.classList.remove("warning");
}
