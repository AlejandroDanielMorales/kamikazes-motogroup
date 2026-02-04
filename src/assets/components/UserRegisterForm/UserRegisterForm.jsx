import { useForm } from "react-hook-form";

export default function UserRegisterForm({ onNext, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  return (
    <form className="form" onSubmit={handleSubmit(onNext)}>

      {/* Nombre */}
      <div className="form-group">
        <label>Nombre completo *</label>
        <input
          type="text"
          {...register("name", { required: "El nombre es obligatorio" })}
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          {...register("email", { required: "El email es obligatorio" })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Contraseña *</label>
        <input
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" }
          })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      {/* Teléfono */}
      <div className="form-group">
        <label>Teléfono *</label>
        <input
          type="text"
          {...register("phone", { required: "El teléfono es obligatorio" })}
        />
        {errors.phone && <span className="error">{errors.phone.message}</span>}
      </div>

      {/* Contactos emergencia */}
      <div className="form-row">
        <div className="form-group">
          <label>Contacto emergencia 1 *</label>
          <input
            type="text"
            {...register("emergencyContact1", {
              required: "Campo obligatorio"
            })}
          />
          {errors.emergencyContact1 && (
            <span className="error">{errors.emergencyContact1.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Contacto emergencia 2</label>
          <input
            type="text"
            {...register("emergencyContact2")}
          />
        </div>
      </div>

      {/* Fecha + sexo */}
      <div className="form-row">
        <div className="form-group">
          <label>Fecha de nacimiento *</label>
          <input
            type="date"
            {...register("birthDate", {
              required: "Campo obligatorio"
            })}
          />
          {errors.birthDate && (
            <span className="error">{errors.birthDate.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Sexo *</label>
          <select
            {...register("sex", { required: "Seleccioná una opción" })}
          >
            <option value="">Seleccionar</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="X">Otro</option>
          </select>
          {errors.sex && <span className="error">{errors.sex.message}</span>}
        </div>
      </div>

      {/* Avatar */}
      <div className="form-group">
        <label>Foto de perfil *</label>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "La imagen es obligatoria" })}
        />
        {errors.image && <span className="error">{errors.image.message}</span>}
      </div>

      <button type="submit" className="btn-primary">
        Siguiente
      </button>
    </form>
  );
}
