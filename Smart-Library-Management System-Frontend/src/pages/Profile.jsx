export const Profile = ({ user }) => {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        My Profile
      </h2>

      {!user ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 space-y-6">

          <div>
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                user.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {user.role}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};