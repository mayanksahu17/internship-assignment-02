import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  createdAt: string;
  avatar: string;
  Bio: string;
  jobTitle: string;
  profile: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get<User[]>('https://602e7c2c4410730017c50b9d.mockapi.io/users')
      .then(response => {
        const sortedUsers = response.data.sort((a, b) => a.profile.username.localeCompare(b.profile.username));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredUsers = users.filter(user =>
      user.profile.username.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredUsers);
  };

  return (
    <div className="flex bg-black text-white min-h-screen">
      <div className="w-1/2 p-4">
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:border-indigo-500"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {filteredUsers.map(user => (
              <li key={user.id} className="cursor-pointer py-2" onClick={() => handleUserClick(user)}>
                <img src={user.avatar} alt={user.profile.username} className="w-8 h-8 rounded-full" />
                <span className="ml-2">{user.profile.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-1/2 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : selectedUser ? (
          <div className='ml-10 mt-20 border-2 border-white p-4 flex'>
            <img src={selectedUser.avatar} alt="" className='h-40 w-40' />
            <div className='ml-6'>
            <h2 className="text-2xl font-semibold">{selectedUser.profile.username}</h2>
            <p>Email: {selectedUser.profile.email}</p>
            <p>Bio: {selectedUser.Bio}</p>
            <p>Job Title: {selectedUser.jobTitle}</p>
            {/* Add more user details as needed */}
            </div>
          </div>
        ) : (
          <p>Select a user to view details</p>
        )}
      </div>
    </div>
  );
};

export default App;
