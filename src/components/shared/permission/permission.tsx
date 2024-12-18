"use client";
// import sidebarService from '@/frontend/utilities/sidebar';
import withPermission from '@/components/HOC/withPermission';
import React, { useEffect, useState, useCallback } from 'react';
import CheckboxList from '@/components/shared/checkbox/checkbox';
import { Button } from '@mui/material';
import styles from "./permission.module.scss";
import AppFeatureService from '@/service/feature.service';
import { AppFeature } from '@/types/schema/appFeature';
import FeaturePermissionService from '@/service/featurePermission.service';
import { createFeaturePermission } from '@/types/schema/featurePermission';
import { permission } from '@/auth/access.service';
import Authorized from '../authorized/authorized';
import Loader from '../loader/loader';

interface Props {
    id: string;
    type: string;
}

const FeaturePermissionComponent: React.FC<Props> = ({ id, type }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [canView, setCanView] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [update, setUpdate] = useState<boolean>(false);
    const [ItemPermissions, setItemPermission] = useState<AppFeature[]>([]);
    const [voucherPermissions, setVoucherPermission] = useState<AppFeature[]>([]);
    const [loginPermissions, setLoginPermission] = useState<AppFeature[]>([]);
    const [contactPermissions, setContactPermission] = useState<AppFeature[]>([]);
    const [ledgerPermissions, setLedgerPermission] = useState<AppFeature[]>([]);
    const [settingPermissions, setSettingPermission] = useState<AppFeature[]>([]);
    const [rolePermissions, setRolePermission] = useState<AppFeature[]>([]);
    const [userPermissions, setUserPermission] = useState<AppFeature[]>([]);
    const [profilePermissions, setProfilePermission] = useState<AppFeature[]>([]);
    const [groupPermissions, setGroupPermission] = useState<AppFeature[]>([]);
    const [featurePermissions, setFeaturePermission] = useState<AppFeature[]>([]);
    const [AppFeaturePermissions, setAppFeaturePermission] = useState<AppFeature[]>([]);
    const [analyticsPermission, setAnalyticsPermissions] = useState<AppFeature[]>([]);
    const [parentType, setParentType] = useState<string>(type);
    const [parentId, setParentId] = useState<string>(id);
    const [updateId, setUpdateId] = useState<string>(id);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const appFeatureService: AppFeatureService = new AppFeatureService();
    const featurePermissionService: FeaturePermissionService = new FeaturePermissionService();

    const fetchData = useCallback(async () => {
        await checkAlreadyExistingFeatures(parentType, parentId);
        setAnalyticsPermissions(await getByParent("analytics.*"));
        setCanView(await permission("featurePermission.*"));
        setCanEdit(await permission("featurePermission.update.*"));
        setLoginPermission(await getByParent("login.*"));
        setUserPermission(await getByParent("user.*"));
        setRolePermission(await getByParent("role.*"));
        setSettingPermission(await getByParent("setting.*"));
        setGroupPermission(await getByParent("group.*"));
        setFeaturePermission(await getByParent("feature.*"));
        setAppFeaturePermission(await getByParent("featurePermission.*"));
        setItemPermission(await getByParent("item.*"));
        setVoucherPermission(await getByParent("voucher.*"));
        setContactPermission(await getByParent("customer.*"));
        // setLedgerPermission(await getByParent("ledger.*"));
        setProfilePermission(await getByParent("profile.*"));
        setLoading(false);
    }, [parentId, parentType]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleEditMode = () => {
        setEditMode(prevEditMode => !prevEditMode);
    };

    // useEffect(() => {
    //     // Hide the sidebar when the component mounts
    //     sidebarService.toggleSidebars(false);

    //     // Clean up: Reset sidebar when component unmounts
    //     return () => {
    //         sidebarService.toggleSidebars(false);
    //     };
    // }, []);

    const checkAlreadyExistingFeatures = async (parentType: string, parentId: string) => {
        try {
            const features = await featurePermissionService.getAllowedFeatures(parentType, parentId);
            if (features.allowedFeatures) {
                if (features.allowedFeatures.length !== 0) {
                    setUpdate(true);
                    setUpdateId(features.id);
                    
                } else {
                    setUpdate(false);
                }

                setSelectedIds(features.allowedFeatures);
                setLoading(false);
            } else {
                setUpdate(false);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("error fetching", error);
        }
    };

    const createFeaturePermission = async (data: createFeaturePermission) => {
        try {
            await featurePermissionService.createFeaturePermission(data);
            handleFormDiscard();
        } catch (error) {
            console.error("error creating", error);
        }
    };

    const updateFeaturePermission = async (id: string, data: createFeaturePermission) => {
        try {
            await featurePermissionService.updateFeaturePermission(id, data);
            handleFormDiscard();
        } catch (error) {
            console.error("error updating", error);
        }
    };

    const getByParent = async (parent: string): Promise<AppFeature[]> => {
        try {
            const data: AppFeature[] = await appFeatureService.getAppFeatureByParent(parent);
            return data;
        } catch (error) {
            console.log("error fetching data", error);
            return [];
        }
    };

    const handleSelectedIdsChange = (newSelectedIds: string[]) => {
        setSelectedIds(newSelectedIds);
    };

    const handleSubmit = async () => {
        const obj: createFeaturePermission = {
            parentType: parentType,
            parentId: parentId,
            allowedFeatures: selectedIds
        };

        if (update) {
            await updateFeaturePermission(updateId, obj);
        } else {
            await createFeaturePermission(obj);
        }

        toggleEditMode();
    };

    const handleFormDiscard = () => {
        setLoading(true);
        fetchData();
    };

    if (!canView) {
        return <Authorized />;
    }




    return (
        <div>
            <h1 className={styles.topHeading}>Feature Permissions</h1>

            {canEdit && <Button variant="outlined" onClick={toggleEditMode}>
                {editMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
            </Button>}

            {!loading ? (<div className={styles.container}>
                {!loading && <>
                    <h2 className={styles.heading}>Login Access </h2>
                    <div className={styles.group}>
                        <CheckboxList heading="Login" features={loginPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        {/* <CheckboxList heading="Features" features={featurePermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} /> */}
                    </div>
                    <h2 className={styles.heading}>Security</h2>
                    <div className={styles.group}>
                        <CheckboxList heading="Analytics" features={analyticsPermission} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="User" features={userPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Role" features={rolePermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Group" features={groupPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Permissions" features={AppFeaturePermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                    </div>
                    <h2 className={styles.heading}>Application Feature</h2>
                    <div className={styles.group}>
                        <CheckboxList heading="Profile" features={profilePermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Setting" features={settingPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Item" features={ItemPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Voucher" features={voucherPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        <CheckboxList heading="Customer" features={contactPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} />
                        {/* <CheckboxList heading="Ledger" features={ledgerPermissions} selectedIds={selectedIds} onSelectedIdsChange={handleSelectedIdsChange} edit={editMode} /> */}
                    </div>
                </>}
            </div>) : (<Loader />)}
            {!loading && editMode && (
                <>
                    <div className={styles.buttonContainer}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}   >
                            Submit
                        </Button>

                        <Button variant="outlined" color="secondary" onClick={handleFormDiscard}>Discard</Button>
                    </div>
                </>
            )}
        </div>
        // </div>
    );
};

export default FeaturePermissionComponent;
