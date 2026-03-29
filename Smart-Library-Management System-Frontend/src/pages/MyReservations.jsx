import { Calendar, Bookmark } from 'lucide-react';

export const MyReservations = ({ reservations = [], onCancel }) => {
  const activeReservations = reservations.filter(
    (r) => r.status === "ACTIVE"
  ).length;

  const MAX_RESERVATIONS = 3;

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        My Reservations
      </h2>

      {/* Reservation Counter */}
      <div className="mb-6 inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
        Active Reservations: {activeReservations}/{MAX_RESERVATIONS}
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You have no reservations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const isActive = reservation.status === "ACTIVE";

            return (
              <div
                key={reservation.reservationId}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">

                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-gray-800 mb-2"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {reservation.book?.title || "Unknown Book"}
                    </h3>

                    <p className="text-gray-600 mb-2">
                      by {reservation.book?.author || "Unknown Author"}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Reserved:{" "}
                      {reservation.reservationDate
                        ? new Date(
                            reservation.reservationDate
                          ).toLocaleDateString()
                        : "Unknown Date"}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {reservation.status}
                      </div>

                      {reservation.queuePosition && (
                        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          {reservation.queuePosition === 1
                            ? 'Next in Queue'
                            : `Queue Position: #${reservation.queuePosition}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {isActive ? (
                      <button
                        onClick={() =>
                          onCancel(reservation.reservationId)
                        }
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
                      >
                        Cancel Reservation
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                        {reservation.status}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};