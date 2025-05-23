import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { changeAppointmentStatus, usePatientAppointments } from './patient-appointments.resource';

interface CancelAppointmentModalProps {
  closeCancelModal: () => void;
  appointmentUuid: string;
  patientUuid: string;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  closeCancelModal,
  appointmentUuid,
  patientUuid,
}) => {
  const { t } = useTranslation();
  const { mutate } = usePatientAppointments(patientUuid, new Date().toUTCString(), new AbortController());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelAppointment = async () => {
    setIsSubmitting(true);

    changeAppointmentStatus('Cancelled', appointmentUuid)
      .then(() => {
        mutate();
        closeCancelModal();
        showSnackbar({
          isLowContrast: true,
          kind: 'success',
          subtitle: t('appointmentCancelledSuccessfully', 'Appointment cancelled successfully'),
          title: t('appointmentCancelled', 'Appointment cancelled'),
        });
      })
      .catch((err) => {
        showSnackbar({
          title: t('appointmentCancelError', 'Error cancelling appointment'),
          kind: 'error',
          isLowContrast: true,
          subtitle: err?.message,
        });
      });
  };

  return (
    <div>
      <ModalHeader closeModal={closeCancelModal} title={t('cancelAppointment', 'Cancel appointment')} />
      <ModalBody>
        <p>{t('cancelAppointmentModalConfirmationText', 'Are you sure you want to cancel this appointment?')}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeCancelModal}>
          {t('discard', 'Discard')}
        </Button>
        <Button kind="danger" onClick={handleCancelAppointment} disabled={isSubmitting}>
          {t('cancelAppointment', 'Cancel appointment')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default CancelAppointmentModal;
