const availablePlans = {
    "Básico": { price: "R$ 19,90" },
    "Plus": { price: "R$ 29,90" },
    "Premium": { price: "R$ 49,90" }
};

const checkoutForm = document.getElementById("checkout-form");
const checkoutPlan = new URLSearchParams(window.location.search).get("plano");
const selectedPlan = availablePlans[checkoutPlan];
const planName = document.getElementById("checkout-plan");
const planPrice = document.getElementById("checkout-price");
const checkoutMessage = document.getElementById("checkout-message");
const cpfField = checkoutForm.elements.cpf;
const phoneField = checkoutForm.elements.phone;
const submitButton = checkoutForm.querySelector("[type='submit']");

if (selectedPlan) {
    planName.textContent = checkoutPlan;
    planPrice.textContent = `${selectedPlan.price}/mês`;
} else {
    planName.textContent = "Plano não identificado";
    showCheckoutMessage("Não identificamos o plano escolhido. Volte à página de preços e selecione um plano.", true);
}

function onlyDigits(value) {
    return value.replace(/\D/g, "");
}

function isValidCpf(value) {
    const cpf = onlyDigits(value);
    if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;

    for (let digitPosition = 9; digitPosition < 11; digitPosition += 1) {
        let sum = 0;
        for (let index = 0; index < digitPosition; index += 1) {
            sum += Number(cpf[index]) * (digitPosition + 1 - index);
        }
        const remainder = (sum * 10) % 11;
        const expectedDigit = remainder === 10 ? 0 : remainder;
        if (Number(cpf[digitPosition]) !== expectedDigit) return false;
    }
    return true;
}

function showCheckoutMessage(message, isError = false) {
    checkoutMessage.textContent = message;
    checkoutMessage.classList.toggle("error", isError);
    checkoutMessage.classList.add("show");
}

function clearCheckoutMessage() {
    checkoutMessage.textContent = "";
    checkoutMessage.classList.remove("show", "error");
}

cpfField.addEventListener("input", () => {
    const digits = onlyDigits(cpfField.value).slice(0, 11);
    cpfField.value = digits
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    cpfField.setCustomValidity("");
});

phoneField.addEventListener("input", () => {
    const digits = onlyDigits(phoneField.value).slice(0, 11);
    if (digits.length > 10) {
        phoneField.value = digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (digits.length > 6) {
        phoneField.value = digits.replace(/^(\d{2})(\d{4})(\d{1,4})$/, "($1) $2-$3");
    } else if (digits.length > 2) {
        phoneField.value = digits.replace(/^(\d{2})(\d{1,5})$/, "($1) $2");
    } else {
        phoneField.value = digits;
    }
    phoneField.setCustomValidity("");
});

checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearCheckoutMessage();

    if (!selectedPlan) {
        showCheckoutMessage("Volte à página de preços e selecione um plano válido.", true);
        return;
    }

    cpfField.setCustomValidity(isValidCpf(cpfField.value) ? "" : "Informe um CPF válido.");
    const phoneDigits = onlyDigits(phoneField.value);
    phoneField.setCustomValidity(phoneDigits.length >= 10 && phoneDigits.length <= 11 ? "" : "Informe um celular válido com DDD.");

    if (!checkoutForm.reportValidity()) return;

    const formData = new FormData(checkoutForm);
    const requestBody = {
        plan: checkoutPlan,
        customer: {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            cpf: onlyDigits(formData.get("cpf")),
            phone: phoneDigits
        },
        paymentMethod: formData.get("paymentMethod")
    };

    submitButton.disabled = true;
    submitButton.textContent = "Preparando pagamento...";

    try {
        const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        if (!response.ok || typeof result.checkoutUrl !== "string") {
            throw new Error("checkout_unavailable");
        }

        const paymentUrl = new URL(result.checkoutUrl);
        if (paymentUrl.protocol !== "https:") {
            throw new Error("insecure_payment_url");
        }
        window.location.assign(paymentUrl.href);
    } catch {
        showCheckoutMessage("Não foi possível iniciar a cobrança. Nenhum pagamento foi realizado. Tente novamente mais tarde ou fale com o suporte.", true);
        submitButton.disabled = false;
        submitButton.textContent = "Continuar para pagamento seguro";
    }
});