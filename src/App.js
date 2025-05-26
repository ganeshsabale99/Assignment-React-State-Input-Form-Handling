import React, { useEffect, useState } from "react";
import "./App.css";

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  skills: [],
  profilePic: null,
};

const skillOptions = ["HTML", "CSS", "JavaScript", "React"];

export default function App() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("entries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!form.gender) newErrors.gender = "Gender is required";
    if (form.skills.length < 2) newErrors.skills = "Select at least two skills";
    if (!form.profilePic) newErrors.profilePic = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setForm({ ...form, profilePic: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      if (file) reader.readAsDataURL(file);
    } else if (type === "checkbox") {
      const updatedSkills = form.skills.includes(value)
        ? form.skills.filter((s) => s !== value)
        : [...form.skills, value];
      setForm({ ...form, skills: updatedSkills });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const entry = {
      ...form,
      id: Date.now(),
      preview: preview,
    };

    setEntries([entry, ...entries]);
    setForm(initialFormState);
    setPreview(null);
    setErrors({});
  };

  const handleDelete = (id) => {
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
  };

  // return (
  //   <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
  //     <h2>Candidate Registration</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label>Full Name:</label>
  //         <input name="fullName" value={form.fullName} onChange={handleChange} />
  //         <span style={{ color: "red" }}>{errors.fullName}</span>
  //       </div>

  //       <div>
  //         <label>Email:</label>
  //         <input name="email" value={form.email} onChange={handleChange} />
  //         <span style={{ color: "red" }}>{errors.email}</span>
  //       </div>

  //       <div>
  //         <label>Phone:</label>
  //         <input name="phone" value={form.phone} onChange={handleChange} />
  //         <span style={{ color: "red" }}>{errors.phone}</span>
  //       </div>

  //       <div>
  //         <label>Gender:</label>
  //         <label>
  //           <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} /> Male
  //         </label>
  //         <label>
  //           <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} /> Female
  //         </label>
  //         <span style={{ color: "red" }}>{errors.gender}</span>
  //       </div>

  //       <div>
  //         <label>Skills:</label>
  //         {skillOptions.map((skill) => (
  //           <label key={skill}>
  //             <input type="checkbox" name="skills" value={skill} checked={form.skills.includes(skill)} onChange={handleChange} /> {skill}
  //           </label>
  //         ))}
  //         <span style={{ color: "red" }}>{errors.skills}</span>
  //       </div>

  //       <div>
  //         <label>Profile Picture:</label>
  //         <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
  //         <span style={{ color: "red" }}>{errors.profilePic}</span>
  //       </div>

  //       {preview && (
  //         <div>
  //           <p>Image Preview:</p>
  //           <img src={preview} alt="preview" width="100" height="100" />
  //         </div>
  //       )}

  //       <button type="submit">Register</button>
  //     </form>

  //     <hr />

  //     <h3>Registered Candidates</h3>
  //     {entries.length === 0 ? (
  //       <p>No entries yet.</p>
  //     ) : (
  //       entries.map((entry) => (
  //         <div key={entry.id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
  //           <img src={entry.preview} alt="profile" width="100" height="100" />
  //           <p><strong>Name:</strong> {entry.fullName}</p>
  //           <p><strong>Email:</strong> {entry.email}</p>
  //           <p><strong>Phone:</strong> {entry.phone}</p>
  //           <p><strong>Gender:</strong> {entry.gender}</p>
  //           <p><strong>Skills:</strong> {entry.skills.join(", ")}</p>
  //           <button onClick={() => handleDelete(entry.id)}>Delete</button>
  //         </div>
  //       ))
  //     )}
  //   </div>
  // );

  return (
  <div className="container">
    <h2>Candidate Registration</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Full Name:</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} />
        <span className="error">{errors.fullName}</span>
      </div>
      <div>
        <label>Email:</label>
        <input name="email" value={form.email} onChange={handleChange} />
        <span className="error">{errors.email}</span>
      </div>
      <div>
        <label>Phone:</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <span className="error">{errors.phone}</span>
      </div>
      <div>
        <label>Gender:</label>
        <label>
          <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} />
          Male
        </label>
        <label>
          <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} />
          Female
        </label>
        <span className="error">{errors.gender}</span>
      </div>
      <div>
        <label>Skills:</label>
        {skillOptions.map((skill) => (
          <label key={skill}>
            <input type="checkbox" name="skills" value={skill} checked={form.skills.includes(skill)} onChange={handleChange} />
            {skill}
          </label>
        ))}
        <span className="error">{errors.skills}</span>
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
        <span className="error">{errors.profilePic}</span>
      </div>

      {preview && (
        <div className="preview-img">
          <p>Image Preview:</p>
          <img src={preview} alt="preview" width="100" height="100" />
        </div>
      )}

      <button type="submit">Register</button>
    </form>

    <hr />

    <h3>Registered Candidates</h3>
    {entries.length === 0 ? (
      <p>No entries yet.</p>
    ) : (
      entries.map((entry) => (
        <div key={entry.id} className="entry">
          <img src={entry.preview} alt="profile" width="100" height="100" />
          <p><strong>Name:</strong> {entry.fullName}</p>
          <p><strong>Email:</strong> {entry.email}</p>
          <p><strong>Phone:</strong> {entry.phone}</p>
          <p><strong>Gender:</strong> {entry.gender}</p>
          <p><strong>Skills:</strong> {entry.skills.join(", ")}</p>
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))
    )}
  </div>
);

}
