import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createUser, deleteUser, getBearerString, userMockData } from '../APITestHelpers';



describe('User API /getOne', () => {
    beforeAll(async() => {
        userMockData.USER_1 = await createUser();
        userMockData.USER_2 = await createUser();
    });

    afterAll(async() => {
        await deleteUser(userMockData.USER_1.ACCESS_TOKEN);
        await deleteUser(userMockData.USER_2.ACCESS_TOKEN);
    });

    it('статус код 200 и не пустой ответ', async() => {
        const response = await supertest('http://localhost:5000')
            .post('/api/v1/user/getOne')
            .send({
                targetId: userMockData.USER_1.ID,
            }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

        expect(response.statusCode).toBe(200);
        expect(response.body).not.empty;
        console.log(response.body);
    });

    it('статус код 400, пользователь не найден', async() => {
        const response = await supertest('http://localhost:5000')
            .post('/api/v1/user/getOne')
            .send({
                targetId: userMockData.FAKE_USER_ID,
            }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

        expect(response.statusCode).toBe(400);
        console.log(response.body);
    });

    it('статус код 400, значение не id', async() => {
        const response = await supertest('http://localhost:5000')
            .post('/api/v1/user/getOne')
            .send({
                targetId: userMockData.NOT_AN_ID,
            }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

        expect(response.statusCode).toBe(400);
        console.log(response.body);
    });

    it('статус код 400, значение не указано', async() => {
        const response = await supertest('http://localhost:5000')
            .post('/api/v1/user/getOne')
            .send({
                someValue: 'some',
            }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

        expect(response.statusCode).toBe(400);
        console.log(response.body);
    });
});

// describe('User API /getMany', () => {
//     beforeAll(async() => {
//         userMockData.USER_1 = await createUser();
//         userMockData.USER_2 = await createUser();
//     });

//     afterAll(async() => {
//         await deleteUser(userMockData.USER_1.ACCESS_TOKEN);
//         await deleteUser(userMockData.USER_2.ACCESS_TOKEN);
//     });

//     it('статус код 200 и 2 элемента в массиве ответа', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({
//                 targetIds: [userMockData.USER_1.ID, userMockData.USER_2.ID],
//             }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(200);
//         expect(response.body).length(2);
//         console.log(response.body);
//     });

//     it('статус код 200 и 1 элемент в массиве ответа', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({
//                 targetIds: [userMockData.USER_1.ID, userMockData.USER_1.ID],
//             }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(200);
//         expect(response.body).length(1);
//         console.log(response.body);
//     });

//     it('статус код 400, одно из значение не id', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({
//                 targetIds: [userMockData.USER_1.ID, userMockData.NOT_AN_ID],
//             }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(400);
//         console.log(response.body);
//     });

//     it('статус код 400, один из пользователей не найден', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({
//                 targetIds: [userMockData.USER_1.ID, userMockData.NOT_AN_ID],
//             }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(400);
//         console.log(response.body);
//     });

//     it('статус код 400, одно из значений не указано', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({
//                 targetIds: [userMockData.USER_1.ID, userMockData.NOT_AN_ID],
//             }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(400);
//         console.log(response.body);
//     });

//     it('статус код 400, значение не массив', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({
//                 targetIds: [userMockData.USER_1.ID, userMockData.NOT_AN_ID],
//             }).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(400);
//         console.log(response.body);
//     });

//     it('статус код 400, значение не указано', async() => {
//         const response = await supertest('http://localhost:5000')
//             .post('/api/v1/user/getMany')
//             .send({}).set('Authorization', getBearerString(userMockData.USER_1.ACCESS_TOKEN));

//         expect(response.statusCode).toBe(400);
//         console.log(response.body);
//     });
// });


// registration:            <IRegistrationUserRequest, never, IAuthResponse>;
// login:                   <ILoginUserRequest, never, IAuthResponse>;
// logout:                  <void, never, void>;
// refresh:                 <void, never, IAuthResponse>;
// getOne:                  <IGetOneUserRequest, never, IUser>;
// getMany:                 <IGetManyUserRequest, never, IUser[]>
// update:                  <IUpdateUserRequest, never, IUser>;
// delete:                  <void, never, void>;
// blockUser:               <IBlockUserRequest, never, IUser>;
// unblockUser:             <IUnblockUserRequest, never, IUser>;
// requestAccessCode:       <void, never, IUser>;
// sendFriendRequest:       <ISendFriendRequestUserRequest, never, IUser>;
// acceptFriendRequest:     <IAcceptFriendRequestUserRequest, never, IUser>;
// declineFriendRequest:    <IDeclineFriendRequestUserRequest, never, IUser>;
// revokeFriendRequest:     <IRevokeFriendRequestUserRequest, never, IUser>;
// deleteFriend:            <IDeleteFriendUserRequest, never, IUser>;
// requestActivationLink:   <void, never, void>;
// activateAccount:         <void, IActivateAccountUserRequest, void>;
// changeAvatar:            <IChangeAvatarUserRequest, never, IUser>;
// changePassword:          <IChangePasswordUserRequest, never, void>;
// changeExtraStatus:       <IChangeExtraStatusUserRequest, never, IUser>;
// verifyAccessCode:        <IVerifyAccessCodeUserReuqest, never, void>;