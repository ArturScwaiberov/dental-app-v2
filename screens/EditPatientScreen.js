import React, { useState } from 'react'
import {
	Container,
	Content,
	Form,
	Item,
	Input,
	Label,
	Icon,
	Text,
	Button,
	Picker,
} from 'native-base'
import styled from 'styled-components/native'

import { patientsApi } from '../utils'
import { Keyboard, Alert } from 'react-native'

const EditPatientScreen = ({ navigation, route }) => {
	const { patientId } = route.params
	const [values, setValues] = useState({
		avatar: patientId.avatar,
		fullName: patientId.fullName,
		phone: patientId.phone,
		gender: patientId.gender,
		email: patientId.email,
	})

	const setFieldValue = (name, value) => {
		setValues({
			...values,
			[name]: value,
		})
	}

	const handleInputChange = (name, e) => {
		const text = e.nativeEvent.text
		setFieldValue(name, text)
	}

	const fieldsName = {
		fullName: '"имя"',
		phone: '"телефон"',
		gender: '"пол"',
		email: '"почта"',
	}

	const submitHandler = () => {
		patientsApi
			.update(patientId._id, values)
			.then(() => {
				navigation.navigate('PatientsList')
			})
			.catch((e) => {
				if (e.response.data && e.response.data.message) {
					Keyboard.dismiss()
					e.response.data.message.forEach((err) => {
						const fieldErr = err.msg
						const fieldName = err.param
						Alert.alert(`Поле ${fieldsName[fieldName]}`, fieldErr)
					})
				}
			})
		/* alert(JSON.stringify(values)) */
	}

	return (
		<Container>
			<Content style={{ paddingLeft: 20, paddingRight: 20 }}>
				<Form>
					{/* <Item picker style={{ borderWidth: 0 }} >
						<Input
							onChange={handleInputChange.bind(this, 'avatar')}
							value={values.avatar}
							clearButtonMode='while-editing'
							placeholder='Аватар'
						/>
					</Item> */}
					<Item picker>
						<Input
							onChange={handleInputChange.bind(this, 'fullName')}
							value={values.fullName}
							clearButtonMode='while-editing'
							placeholder='* ФИО (мин 4)'
							/* autoFocus */
						/>
					</Item>
					<Item picker>
						<Input
							onChange={handleInputChange.bind(this, 'phone')}
							value={values.phone}
							keyboardType='phone-pad'
							clearButtonMode='while-editing'
							placeholder='* 996-700-126-646'
						/>
					</Item>
					<Item picker>
						<Input
							onChange={handleInputChange.bind(this, 'email')}
							value={values.email}
							keyboardType='email-address'
							clearButtonMode='while-editing'
							placeholder='* Почта'
						/>
					</Item>

					<Item picker /* style={{ marginTop: 20 }} */>
						<Picker
							mode='dropdown'
							iosHeader='Выберите пол'
							headerBackButtonText='Отмена'
							headerTitleStyle={{ color: '#2A86FF', width: 200, fontWeight: 'bold', fontSize: 20 }}
							iosIcon={<Icon name='arrow-down' />}
							placeholder='* Пол пациента'
							selectedValue={values.gender}
							onValueChange={setFieldValue.bind(this, 'gender')}
						>
							<Picker.Item label='Мужской' value='male' />
							<Picker.Item label='Женский' value='femail' />
						</Picker>
					</Item>

					<ButtonView>
						<Button
							onPress={submitHandler}
							rounded
							block
							iconLeft
							style={{ backgroundColor: '#2A86FF' }}
						>
							<Icon type='Entypo' name='check' style={{ color: '#fff' }} />
							<Text style={{ color: '#fff' }}>Сохранить</Text>
						</Button>
					</ButtonView>
					<Label style={{ marginTop: 20, fontSize: 16 }}>
						Поля помеченные звездочкой <TomatoText>*</TomatoText> обязательны для заполнения
					</Label>
				</Form>
			</Content>
		</Container>
	)
}

const ButtonView = styled.View({
	marginTop: 30,
})

const TomatoText = styled.Text({
	color: 'tomato',
})

export default EditPatientScreen
