import { useState } from "react";
import axios from "axios";
import UserRegisterForm from "../../components/UserRegisterForm/UserRegisterForm";
import MotoRegisterForm from "../../components/MotoRegisterForm/MotoRegisterForm";

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  /* =======================
     PASO 1 – USUARIO
  ======================= */
  const handleUserNext = (data) => {
    const fixedData = {
      ...data,
      image: data.image?.[0] ?? null // ✅ File real
    };

    console.log("➡️ Paso 1 - userData FIXED:", fixedData);
    setUserData(fixedData);
    setStep(2);
  };

  const handleMotoBack = () => {
    setStep(1);
  };

  /* =======================
     HELPER
  ======================= */
  const appendFormDataSafe = (formData, key, value) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  };

  /* =======================
     PASO FINAL
  ======================= */
  const handleFinalSubmit = async (motoFormData) => {
    const fixedMotoData = {
      ...motoFormData,
      image: motoFormData.image?.[0] ?? null // ✅ File real
    };

    console.log("➡️ Paso 2 - motoData FIXED:", fixedMotoData);

    if (!userData || Object.keys(userData).length === 0) {
      alert("Datos de usuario inválidos");
      return;
    }

    if (!fixedMotoData || Object.keys(fixedMotoData).length === 0) {
      alert("Datos de la moto inválidos");
      return;
    }

    setLoading(true);

    try {
      /* =======================
         1️⃣ CREAR USUARIO
      ======================= */
      const userFormData = new FormData();

      Object.entries(userData).forEach(([key, value]) => {
        appendFormDataSafe(userFormData, key, value);
      });

      console.log("📤 Enviando usuario...");
      const userRes = await axios.post(
        `${API_URL}/auth/register`,
        userFormData
      );

      const userId = userRes?.data?._id;

      if (!userId) {
        throw new Error("No se recibió el ID del usuario");
      }

      console.log("✅ Usuario creado con ID:", userId);

      /* =======================
         2️⃣ CREAR MOTO (SOLUCIÓN 2)
      ======================= */
      const motoFormDataFinal = new FormData();

      // ✅ campos de la moto (uno por uno)
      motoFormDataFinal.append("brand", fixedMotoData.brand);
      motoFormDataFinal.append("model", fixedMotoData.model);
      motoFormDataFinal.append("year", fixedMotoData.year);
      motoFormDataFinal.append("displacementCc", fixedMotoData.displacementCc);
      motoFormDataFinal.append("plate", fixedMotoData.plate);
      motoFormDataFinal.append("color", fixedMotoData.color);

      // ✅ owner
      motoFormDataFinal.append("owner", userId);

      // ✅ imagen
      if (fixedMotoData.image) {
        motoFormDataFinal.append("image", fixedMotoData.image);
      }

      console.log("📤 Enviando moto con campos planos...");
      await axios.post(
        `${API_URL}/motos`,
        motoFormDataFinal
      );

      console.log("✅ Moto creada correctamente");
      alert("Registro completado correctamente 🎉");

    } catch (err) {
      console.error("🔥 Error en registro:", err);

      if (err.response) {
        console.error("📩 Response:", err.response.data);
      }

      alert(
        "Error en el registro.\n" +
        "Es posible que el usuario se haya creado pero la moto no."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 1 && (
        <UserRegisterForm
          onNext={handleUserNext}
          defaultValues={userData}
        />
      )}

      {step === 2 && (
        <MotoRegisterForm
          onBack={handleMotoBack}
          onSubmitFinal={handleFinalSubmit}
          loading={loading}
        />
      )}
    </>
  );
}
