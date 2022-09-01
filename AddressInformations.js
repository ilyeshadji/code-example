import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Text from '../UIElements/Text';
import RadioButton from '../UIElements/RadioButton';

import {
    setShipmentOriginAddress,
    setShipmentDestinationAddress,
} from '../../store/shipment/shipmentSlice';
import Selector from '../UIElements/Selector';
import countryList from 'react-select-country-list';
import TextInput from '../UIElements/TextInput';
import Button from '../UIElements/Button';
import { setColor } from '../../utils/styles';

function AddressInformations({ id, label, rightSection }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const countries = useMemo(() => countryList().getData(), []);

    const [addressType, setAddressType] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [business, setBusiness] = useState('');

    useEffect(() => {
        const payload = {
            addressType,
            country,
            postalCode,
            city,
            business,
        };

        if (id === 'origin') {
            dispatch(setShipmentOriginAddress(payload));
        } else if (id === 'destination') {
            dispatch(setShipmentDestinationAddress(payload));
        }
    }, [addressType, id, dispatch, country, postalCode, city, business]);

    return (
        <Container rightSection={rightSection}>
            <Text fontWeight={'bold'} fontSize={'14px'} marginBot={'10px'}>
                {label}
            </Text>

            <TypeContainer>
                <Text fontWeight={'bold'} fontSize={'14px'}>
                    {t('newShipment.address_type')}
                </Text>

                <RadioButton
                    id={'private'}
                    label={t('newShipment.private')}
                    size={'s'}
                    margin={'0px 0px 0px 10px'}
                    value={addressType}
                    onClick={() => setAddressType('private')}
                />

                <RadioButton
                    id={'business'}
                    label={t('newShipment.business')}
                    size={'s'}
                    margin={'0px 0px 0px 10px'}
                    value={addressType}
                    onClick={() => setAddressType('business')}
                />
            </TypeContainer>

            <Address>
                <AddressLine>
                    <CountryContainer>
                        <Selector
                            options={countries}
                            value={country}
                            onChange={(e) => setCountry(e)}
                            title={t('country')}
                            line
                        />
                    </CountryContainer>

                    <InputContainer right>
                        <TextInput
                            type="text"
                            label={t('postal-code')}
                            labelSize="16px"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            line
                            marginBottom="0"
                        />
                    </InputContainer>
                </AddressLine>

                <AddressLine>
                    <InputContainer>
                        <TextInput
                            type="text"
                            label={t('city')}
                            labelSize="16px"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            line
                            marginBottom="0"
                        />
                    </InputContainer>

                    <InputContainer right>
                        <TextInput
                            type="text"
                            label={t('company')}
                            labelSize="16px"
                            value={business}
                            onChange={(e) => setBusiness(e.target.value)}
                            line
                            marginBottom="0"
                        />
                    </InputContainer>
                </AddressLine>
            </Address>

            <OrContainer>
                <Text color={setColor.grey}>- {t(`or`).toUpperCase()} -</Text>
            </OrContainer>

            <AddressButtonContainer>
                <Button
                    onClick={() => {
                        // TODO: addresses
                    }}
                    backgroundColor={setColor.red}
                    textColor={setColor.white}
                    hoverBackground={setColor.paleRed}
                    hoverTextColor={setColor.white}
                >
                    {t('newShipment.select_in_address_book')}
                </Button>
            </AddressButtonContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin-left: ${(props) => (props.rightSection ? '100px' : '')};
`;

const TypeContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`;

const Address = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const AddressLine = styled.div`
    display: flex;
    flex-direction: row;
`;

const CountryContainer = styled.div`
    display: flex;
    width: 100%;
`;

const InputContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    margin-left: ${(props) => (props.right ? '10px' : 0)};
`;

const OrContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 20px;
`;

const AddressButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 20px 0px 10px 0px;
`;

export default AddressInformations;
