import { useNavigate } from "react-router-dom";

export const navigateToAddInPatient = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/inpatient/add")
    }

    return applyNavigation;
}

export const navigateToInPatients = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/inpatients/")
    }

    return applyNavigation;
}

export const navigateToAddNewOutPatient = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/outpatient/add")
    }

    return applyNavigation;
}

export const navigateToOutPatients = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/outpatients")
    }
    return applyNavigation;
}

export const navigateToAddUser = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/user/addnew")
    }
    return applyNavigation;
}

export const navigateToUsers = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/user/list")
    }
    return applyNavigation;
}

export const isAuthenticated = () => {
    if(localStorage.getItem('auth-details') == null) {
        return false;
    }
    return true;
}

export const whoIs = () => {
    if(isAuthenticated()) {
        return JSON.parse(localStorage.getItem('auth-details')).user;
    }
    return {};
}