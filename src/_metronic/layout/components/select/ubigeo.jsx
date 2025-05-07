import React, { useState, useEffect } from "react";
import ubigeoData from "./ubigeo.json";

const DDLUbigeo = ({ onUbigeoChange }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState("");

  useEffect(() => {
    const uniqueDepartamentos = [...new Set(ubigeoData.map(row => row.Departamento))];
    setDepartamentos(uniqueDepartamentos);
  }, []);

  useEffect(() => {
    if (selectedDepartamento) {
      const filteredProvincias = ubigeoData
        .filter(row => row.Departamento === selectedDepartamento)
        .map(row => row.Provincia);
      setProvincias([...new Set(filteredProvincias)]);
      setDistritos([]);
      setSelectedProvincia("");
      setSelectedDistrito("");
    }
  }, [selectedDepartamento]);

  useEffect(() => {
    if (selectedProvincia) {
      const filteredDistritos = ubigeoData
        .filter(row => row.Departamento === selectedDepartamento && row.Provincia === selectedProvincia)
        .map(row => row.Distrito);
      setDistritos([...new Set(filteredDistritos)]);
      setSelectedDistrito("");
    }
  }, [selectedProvincia]);

  useEffect(() => {
    onUbigeoChange({
      departamento: selectedDepartamento,
      provincia: selectedProvincia,
      distrito: selectedDistrito
    });
  }, [selectedDepartamento, selectedProvincia, selectedDistrito, onUbigeoChange]);

  return (
    <div className="row">
      <div className="col-lg-4">
        <label>Departamento</label>
        <select
          className="form-control"
          value={selectedDepartamento}
          onChange={(e) => setSelectedDepartamento(e.target.value)}
        >
          <option value="">Selecciona un departamento</option>
          {departamentos.map((dep, i) => (
            <option key={i} value={dep}>{dep}</option>
          ))}
        </select>
      </div>

      <div className="col-lg-4 mb-4">
        <label>Provincia</label>
        <select
          className="form-control"
          value={selectedProvincia}
          onChange={(e) => setSelectedProvincia(e.target.value)}
          disabled={!selectedDepartamento}
        >
          <option value="">Selecciona una provincia</option>
          {provincias.map((prov, i) => (
            <option key={i} value={prov}>{prov}</option>
          ))}
        </select>
      </div>

      <div className="col-lg-4 mb-4">
        <label>Distrito</label>
        <select
          className="form-control"
          value={selectedDistrito}
          onChange={(e) => setSelectedDistrito(e.target.value)}
          disabled={!selectedProvincia}
        >
          <option value="">Selecciona un distrito</option>
          {distritos.map((dist, i) => (
            <option key={i} value={dist}>{dist}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DDLUbigeo;
