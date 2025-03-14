import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/pets', {
          headers: { 'x-auth-token': token }
        });
        setPets(res.data);
      } catch(err) {
        console.error(err);
      }
    };
    fetchPets();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">My Pets</h2>
      <Link to="/pets/new" className="bg-blue-500 text-white py-2 px-4 rounded">Add New Pet</Link>
      <div className="mt-4">
        {pets.map(pet => (
          <div key={pet._id} className="bg-white p-4 rounded shadow mb-2">
            <h3 className="text-xl">{pet.name}</h3>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            <p>{pet.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetList;
