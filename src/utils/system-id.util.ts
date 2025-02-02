import {UserType} from "../enums";

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const sysIdGenerator = (mainCenterCode: string | undefined, userType: UserType): string => {
    const centerPrefix = mainCenterCode?.toLowerCase() || 'unk';
    const userTypeCode = userType === UserType.STUDENT ? 'stu' : 'sta';

    let uniqueId = '';
    const charactersLength = characters.length;

    for (let i = 0; i < 4; i++) {
        uniqueId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return `${userTypeCode}-${centerPrefix}-${uniqueId}`;
}

