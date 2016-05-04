import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const cancelReservationEdit = createAction(types.UI.CANCEL_RESERVATION_EDIT);

const changeAdminReservationsFilters = createAction(types.UI.CHANGE_ADMIN_RESERVATIONS_FILTERS);

const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

const clearReservations = createAction(types.UI.CLEAR_RESERVATIONS);

const closeConfirmReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_CONFIRM
);

const closeReservationCancelModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_CANCEL
);

const closeReservationDeleteModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_DELETE
);

const closeReservationInfoModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_INFO
);

const closeReservationSuccessModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_SUCCESS
);

const openConfirmReservationModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_CONFIRM
);

const openReservationCancelModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_CANCEL
);

const openReservationDeleteModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_DELETE
);

const openReservationInfoModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_INFO
);

const selectReservationToCancel = createAction(
  types.UI.SELECT_RESERVATION_TO_CANCEL
);

const selectReservationToDelete = createAction(
  types.UI.SELECT_RESERVATION_TO_DELETE
);

const selectReservationToEdit = createAction(
  types.UI.SELECT_RESERVATION_TO_EDIT
);

const selectReservationToShow = createAction(
  types.UI.SELECT_RESERVATION_TO_SHOW
);

const toggleTimeSlot = createAction(types.UI.TOGGLE_TIME_SLOT);

export default {
  cancelReservationEdit,
  changeAdminReservationsFilters,
  changeSearchFilters,
  clearReservations,
  closeConfirmReservationModal,
  closeReservationCancelModal,
  closeReservationDeleteModal,
  closeReservationInfoModal,
  closeReservationSuccessModal,
  openConfirmReservationModal,
  openReservationCancelModal,
  openReservationDeleteModal,
  openReservationInfoModal,
  selectReservationToCancel,
  selectReservationToDelete,
  selectReservationToEdit,
  selectReservationToShow,
  toggleTimeSlot,
};
