// import { ValidationChain } from 'express-validator';
// import { isArray, isEmail, isEmailUnoccupied, isLoginUnoccupied, isMongoId, isntInMyBlockList, isntInMyFriendList, isInMyBlockList, isUserExistById, isInMyFriendList, isUsersExistsById, isValidLogin, isValidPassword, notEmpty, nullable, sanitizeInput, toString } from './validationChains';



// type ValidationChainContainerType = (fieldName: string) => ValidationChain[];

// interface IValidationChainContainers {
//     [x: string]: string;
//     // notOccupiedEmail: ValidationChainContainerType;
//     // notOccupiedLogin: ValidationChainContainerType;
//     // userId: ValidationChainContainerType;
//     // validLogin: ValidationChainContainerType;
//     // validPassword: ValidationChainContainerType;
//     // userIds: ValidationChainContainerType;
//     // userUpdate: ValidationChainContainerType;
//     // validString: ValidationChainContainerType;
//     // userToBlock: ValidationChainContainerType;
//     // userToUnblock: ValidationChainContainerType;
//     // userToFriend: ValidationChainContainerType;
//     // userToUnfriend: ValidationChainContainerType;
// }

// export const ValidationChainContainers: IValidationChainContainers = {
//     notOccupiedEmail(fieldName) {
//         return [
//             nullable(),
//             sanitizeInput(),
//             notEmpty(),
//             toString(),
//             isEmail(),
//             isEmailUnoccupied(),
//         ];
//     },

//     notOccupiedLogin(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             toString(),
//             isLoginUnoccupied(),
//         ];
//     },

//     validString(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             toString(),
//         ];
//     },

//     userId(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             isMongoId(),
//             isUserExistById(),
//         ];
//     },

//     validLogin(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             toString(),
//             isValidLogin(),
//         ];
//     },

//     validPassword(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             toString(),
//             isValidPassword(),
//         ];
//     },

//     userIds(fieldName) {
//         const fieldsInArray = `${fieldName}.*`;
//         return [
//             isArray(),
//             notEmpty(),
//             sanitizeInput({ fieldName: fieldsInArray }),
//             isMongoId({ fieldName: fieldsInArray, plural: true }),
//             isUsersExistsById(),
//         ];
//     },

//     userUpdate(fieldName) {
//         const usernameFieldName = `${fieldName}.username`;
//         return [
//             nullable({ fieldName: usernameFieldName }),
//             sanitizeInput({ fieldName: usernameFieldName }),
//             toString({ fieldName: usernameFieldName }),
//         ];
//     },

//     userToBlock(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             isMongoId(),
//             isUserExistById(),
//             isntInMyBlockList(),
//         ];
//     },

//     userToUnblock(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             isMongoId(),
//             isUserExistById(),
//             isInMyBlockList(),
//         ];
//     },

//     userToFriend(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             isMongoId(),
//             isUserExistById(),
//             isntInMyBlockList(),
//             isntInMyFriendList(),
//         ];
//     },

//     userToUnfriend(fieldName) {
//         return [
//             sanitizeInput(),
//             notEmpty(),
//             isMongoId(),
//             isUserExistById(),
//             isInMyFriendList(),
//         ];
//     },
// };
