import React, { FunctionComponent, useState } from 'react';

/* Components */
import { Modal, Image, Button, HorizontalLine, Link } from 'components/atoms';
import { Flex, FormInput } from 'components/molecules';

/* Types */
import { SignUpWithEmailSuccessModalProps } from './sign-up-with-email-success.types';
import { OnInputChange } from 'common/types';

/* Styles */
import './sign-up-with-email-success.scss';

/* Assets */
import SuccessImage from 'assets/images/confirm-invitation-success-modal.svg';
import { ROUTES } from 'common/constants';

const SignUpWithEmailSuccessModal: FunctionComponent<SignUpWithEmailSuccessModalProps> = ({ modalState }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const onPhoneChange: OnInputChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const onAddPhoneNumber = () => {
    console.log('add phone number');
  };

  return (
    <Modal showModal={modalState} nonTransparentBackground closeButtonIcon={false}>
      {/* Image */}
      <Flex.Layout justifyContent="center">
        <Image src={SuccessImage} />
      </Flex.Layout>

      {/* Heading */}
      <Flex.Layout className="sign-up-with-email-modal__heading" justifyContent="center">
        Account created successfully!
      </Flex.Layout>

      {/* Paragraph */}
      <Flex.Layout className="sign-up-with-email-modal__paragraph">
        Some cool copy why we are collecting additional informationSome cool copy why we are collecting additional
        informationSome cool copy why we are collecting additional information
      </Flex.Layout>

      {/* Phone number input */}
      <FormInput name="phone" value={phoneNumber} onChange={onPhoneChange} placeholder="Your phone" topSpacing />

      {/* Add phone submit button */}
      <Flex.Layout justifyContent="center">
        <Button onClick={onAddPhoneNumber}>ADD PHONE</Button>
      </Flex.Layout>

      <HorizontalLine />

      {/* Skip step */}
      <Flex.Layout justifyContent="center" className="sign-up-with-email-modal__skip">
        <Link href={ROUTES.HOME}>Skip</Link>
      </Flex.Layout>
    </Modal>
  );
};

export default SignUpWithEmailSuccessModal;
