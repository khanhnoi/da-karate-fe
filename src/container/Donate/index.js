/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import CountUp from 'react-countup';
import { GET_LIST_EVENT_DONATE, GET_LIST_DONATE, DELETE_DONATE, UPDATE_DONATE_REQUEST, ACCEPT_DONATE } from '../../constants/config';
import { PER_PAGE } from '../../constants/variable';
import { confirmDelete, checkAccept, showMessage, moneyFormat } from '../../helpers/table';
import createNotification from '../../component/common/Notification';
import { postData, deleteById, getTakenData, putDataAccept } from '../../services/base_services';

import Table from '../../component/common/Table';
import Paginate from '../../component/Paginate';
import NewButton from '../../component/common/NewButton';
import InputSearch from '../../component/common/InputSearch';
import Select from '../../component/common/Select'
import Datepicker from '../../component/common/Datepicker';

import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/icon/delete-kn.svg';
import checkIcon from '../../assets/images/icon/box-ok-kn.svg';
import donateYellow from '../../assets/images/icon/donate-yellow-kn.svg';
import donateRed from '../../assets/images/icon/donate-red-kn.svg';
import donateBlue from '../../assets/images/icon/donate-blue-kn.svg';
import { formatDate } from '../../helpers/form';
const Donate = (props) => {
    const { history } = props;
    const perPage = PER_PAGE || 5;
    const [maxDonatedMoney, setMaxDonatedMoney] = useState('');
    const [numDonate, setNumDonate] = useState('');
    const [totalDonatedMoney, setTotalDonatedMoney] = useState('')
    const [tableData, setTableData] = useState([]);
    const [paginate, setPaginate] = useState([]);
    const [numberDelete, setNumberDelete] = useState(0);
    const typingTimeoutRef = useRef(null);
    const [key, setKey] = useState('');
    const [idEvent, setIdEvent] = useState('');
    const dateRef = useRef('')
    const [req, setReq] = useState({
        keyword: key,
        page: 1,
        // eslint-disable-next-line camelcase
        per_page: perPage,
        event_id: idEvent,
        date: ""
    });

    const formatDate2 = 'dd-MM-yyyy';

    const IDEventRef = useRef('');
    const [listEventDonate, setListEventDonate] = useState([]);
    const [errors, setErrors] = useState([]);

    const tableHeaders = [
        {
            label: 'STT',
            index: 'stt',
            option: {
                className: 'text-center position-relative'
            },
            callback: null
        },
        {
            label: 'Người Gửi',
            index: null,
            callback: (data) => {
                return (
                    <div>
                        <span>{data && data.name}</span>
                    </div>
                );
            }
        },
        {
            label: 'Ngày Chuyển Khoản',
            index: null,
            callback: (data) => {
                return (
                    <div>
                        <span>{data && data.transfer_date && formatDate(data.transfer_date, "dd-mm-yyyy")}</span>
                    </div>
                );
            }
        },
        {
            label: 'Số Tài Khoản',
            index: null,
            option: {
                className: ''
            },
            callback: (data) => {
                return (
                    <div>
                        <span>{data && data.bank_account_number}</span>
                    </div>
                );
            }
        },
        {
            label: 'Tên Sự Kiện',
            index: null,
            option: {
                className: ''
            },
            callback: (data) => {
                let nameEvent = '';
                const idEvent = data && data.event_id;
                const eventFilters = listEventDonate.filter(event => event.id === idEvent);
                if (eventFilters.length > 0) {
                    nameEvent = eventFilters[0].title;
                }
                return (
                    <div>
                        <span>{nameEvent}</span>
                    </div>
                );
            }
        },
        {
            label: 'Số Tiền',
            index: null,
            option: {
                className: ''
            },
            callback: (data) => {
                return (
                    <div>
                        <span>{moneyFormat(data && data.donated_money)}</span>
                    </div>
                );
            }
        },
        {
            label: 'CHỨC NĂNG',
            index: null,
            option: {
                className: 'text-right fixed-collumn'
            },
            callback: (data) => {
                if (data && data.id) {
                    return (
                        <div className="btn-group">
                            {renderIconCheck(data.status, data.id)}
                            <span
                                data-tip="Chỉnh Sửa Donate"
                                className="link-action ml-2 mr-2"
                            >
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onEditDonate(data.id)}
                                    onKeyPress={() => { }}
                                >
                                    <img alt="edit" src={editIcon} className="btn-icon" />
                                </div>
                            </span>
                            <span data-tip="Xóa Donate" className="link-action ml-2">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onDeleteDonate(data.id)}
                                    onKeyPress={() => { }}
                                >
                                    <img alt="delete" src={deleteIcon} className="btn-icon" />
                                </div>
                            </span>
                            <ReactTooltip
                                className="tooltip-button"
                                place="bottom"
                                effect="float"
                            />
                        </div>
                    );
                }
                return '';
            }
        }
    ];

    const renderIconCheck = (status, id) => {
        if (status === false) {
            return (
                <span
                    data-tip="Xác Nhận Đã Nhận Tiền"
                    className="link-action ml-2 mr-2"
                >
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onCheckDonate(id, 'Xác Nhận Đã Nhận Tiền ?')}
                        onKeyPress={() => { }}
                    >
                        <img alt="edit" src={checkIcon} className="btn-icon" />
                    </div>
                </span>
            )
        }
        return null;
    }

    const onCheckDonate = (id, mes) => {
        checkAccept(mes).then((res) => {
            if (res.value === true) {
                putDataAccept(UPDATE_DONATE_REQUEST, ACCEPT_DONATE, id).then((res) => {
                    showMessage(res.data.message, true);
                    getListDonate(req)
                })
                    .catch(() => {
                        showMessage('CÓ LỖI XẢY RA!', false);
                    });
            }
        });
    };

    const changeEvent = (e) => {
        const value = e.target.value ? e.target.value : '';
        setIdEvent(value);
        setReq({
            ...req, event_id: value, page: 1
        });
    }

    const changeDate = (date) => {
        const searchDate = date.split('-').reverse().join('-');
        setReq({
            ...req, date: searchDate, page: 1
        });
    }

    const getListDonate = async (newReq) => {
        //getListEventDonate
        await getTakenData(GET_LIST_EVENT_DONATE)
            .then((res) => res && res.data)
            .then((data) => {
                setListEventDonate(data);
            });

        await postData(GET_LIST_DONATE, newReq)
            .then((res) => res && res.data)
            .then((res) => {
                setMaxDonatedMoney(res && res.max_donated_money);
                setNumDonate(res && res.num_donate);
                setTotalDonatedMoney(res && res.total_donated_money)
                setPaginate({ ...res.paginate, perPage });
                setTableData(res && res.data);
            });
    };
    const deleteDonate = (id) => {
        deleteById(DELETE_DONATE, id).then(() => {
            setNumberDelete(numberDelete + 1);
            createNotification('success', `Bạn đã xoá thành công`);
        });
    };
    const onEditDonate = (id) => {
        history.push(`/donate/edit/${id}`);
    };
    const onDeleteDonate = (id, name) => {
        confirmDelete().then((res) => {
            if (res && res.value) {
                deleteDonate(id, name);
            }
        });
    };
    const changePage = (pageNumber) => {
        setReq({
            ...req,
            page: pageNumber,

        });
    };
    const onChangeSearch = (e) => {
        const value = e.target.value ? e.target.value : '';
        setKey(value);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setReq({
                ...req,
                keyword: value,
                page: 1
            });
        }, 500);
    };

    useEffect(() => {
        getListDonate(req)
    }, [req, numberDelete]);

    return (
        <>
            <section className="body-right-bottom">
                <div className="container-fluid content">
                    <div className="row top-table">
                        <div className="col-md-12 top-table-title">
                            <p>Quản Lý Thông Tin Quyên Góp </p>
                        </div>
                        <div className="col-md-1 top-table-border "></div>
                        <div className="col-md-12 top-table-text">Tổng Quan</div>
                    </div>
                    <div className="content-form content-form--donate">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="content-title">
                                    <p>Tổng Quan</p>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex">
                                <div className="box-select-donate-left">
                                    <div className="col-select">
                                        <Select
                                            label=""
                                            className="form-control mb-3 input-blu"
                                            name="certificate_id"
                                            ref={IDEventRef}
                                            errors={errors}
                                            key_value="id"
                                            key_label="title"
                                            include_blank="Tất Cả"
                                            data={listEventDonate}
                                            onChange={changeEvent}
                                        />
                                    </div>
                                    <div className="col-space"></div>
                                    <div className="col-select col-select-date">
                                        <Datepicker
                                            label=""
                                            className="form-control-donate"
                                            name="donate_date"
                                            errors={errors}
                                            clearIcon={false}
                                            format={formatDate2}
                                            ref={dateRef}
                                            changeDate={changeDate}
                                        />
                                    </div>
                                    <div className="col-space"></div>
                                </div>
                                <div className="box-select-donate-right" style={{ paddingRight: '23px' }}>
                                    <div className="col-select col-select-add">
                                        <Link to={{ pathname: "/active/event/add", state: { donate: true } }} className="my-auto pb-2" >
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-new btn-new-event"
                                            >
                                                <span>Thêm Sự Kiện</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-form">
                        <div className="row">
                            <div className="col-md-12 col-lg-4">
                                <div className="box-donate box-donate--left">
                                    <div className="box-donate-title">
                                        <p>Số lượt quyên góp</p>
                                    </div>
                                    <div className="box-donate-content">
                                        <div className="box-donate-content-text">
                                            <p><CountUp start={0} end={numDonate} duration={3} separator="." /> lượt</p>
                                        </div>
                                        <div className="box-donate-content-icon">
                                            <img src={donateYellow} alt="" set="" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 col-lg-4">
                                <div className="box-donate box-donate--center">
                                    <div className="box-donate-title">
                                        <p>Số tiền quyên góp</p>
                                    </div>
                                    <div className="box-donate-content">
                                        <div className="box-donate-content-text">
                                            <p><CountUp start={0} end={totalDonatedMoney} duration={1.5} separator="," /> VNĐ</p>
                                        </div>
                                        <div className="box-donate-content-icon">
                                            <img src={donateBlue} alt="" set="" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 col-lg-4">
                                <div className="box-donate box-donate--right">
                                    <div className="box-donate-title">
                                        <p>Số tiền quyên góp lớn nhất</p>
                                    </div>
                                    <div className="box-donate-content">
                                        <div className="box-donate-content-text">
                                            <p><CountUp start={0} end={maxDonatedMoney} duration={1.6} separator="," /> VNĐ</p>
                                        </div>
                                        <div className="box-donate-content-icon">
                                            <img src={donateRed} alt="" set="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 d-flex">
                            <div className="ml-auto d-flex flex-wrap px-15px">
                                <InputSearch onChange={onChangeSearch} />
                            </div>
                            <Link to="/donate/add" className="my-auto pb-2" style={{ paddingRight: '9px' }}  >
                                <NewButton />
                            </Link>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <Table
                                tableData={tableData}
                                tableHeaders={tableHeaders}
                                tablePaginate={paginate}
                            />
                        </div>
                        <div className="table-pagenatie ml-auto">
                            <div className="paginate-wrapper">
                                <Paginate
                                    paginate={paginate}
                                    changePage={changePage}
                                    per={perPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default withRouter(Donate);

Donate.propTypes = {
    history: propTypes.isRequired
};

