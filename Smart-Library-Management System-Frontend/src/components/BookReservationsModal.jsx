import { X } from 'lucide-react';

export const BookReservationsModal = ({
  show,
  onClose,
  reservations = [],
  onCancelReservation
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reservation Queue</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {reservations.length === 0 ? (
          <p className="text-gray-500">No active reservations for this book.</p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation, index) => (
              <div
                key={reservation.reservationId}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    #{index + 1} - {reservation.user?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reservation.user?.email || 'No email'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Reserved:{' '}
                    {reservation.reservationDate
                      ? new Date(reservation.reservationDate).toLocaleString()
                      : 'Unknown'}
                  </p>
                  <p className="text-sm text-purple-700 font-semibold mt-1">
                    {reservation.status}
                  </p>
                </div>

                {reservation.status === 'ACTIVE' && (
                  <button
                    onClick={() => onCancelReservation(reservation.reservationId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};