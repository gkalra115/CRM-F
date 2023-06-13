const init_all_check = () => {
  const $all_check = $('#top-check');
  $all_check.on('click', function () {
    $('label.kt-checkbox.kt-checkbox--single input.check').each((num, el) => {
      $(el).prop('checked', !$(el).prop('checked'));
    });
  });
};
const tc = $('#top-check');
// tc.addEventListener('click', () => {
//   if (tc.checked) {
//     let check = document.getElementsByClassName('check');
//     for (let i = 0; i < check.length; i++) {
//       check[i].checked = true;
//     }
//   } else {
//     let check = document.getElementsByClassName('check');
//     for (let i = 0; i < check.length; i++) {
//       check[i].checked = false;
//     }
//   }
// });

const getAllNotification = () => {
  $.ajax({
    method: 'GET',
    url: '/notifications/all/',
    success: function ({ data, allNotifications, userid }) {
      $('#addReadTask').empty();
      $('#addReadUser').empty();
      $('#addUnReadTask').empty();
      $('#addUnReadUser').empty();
      allNotifications.map((el) => {
        if (el.resource === 'Task') {
          if (
            el.actionEffectsToId.filter((e) => e._id === userid && e.flag)
              .length > 0
          ) {
            $('#addReadTask').append(`
                            <a href="${el.action}" target="_blank" class="kt-notification__item checkBoxNotificationUnRead" data-id="${el._id}">
                                <div class="kt-notification__item-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--brand">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <rect x="0" y="0" width="24" height="24"></rect>
                                            <path d="M5,3 L6,3 C6.55228475,3 7,3.44771525 7,4 L7,20 C7,20.5522847 6.55228475,21 6,21 L5,21 C4.44771525,21 4,20.5522847 4,20 L4,4 C4,3.44771525 4.44771525,3 5,3 Z M10,3 L11,3 C11.5522847,3 12,3.44771525 12,4 L12,20 C12,20.5522847 11.5522847,21 11,21 L10,21 C9.44771525,21 9,20.5522847 9,20 L9,4 C9,3.44771525 9.44771525,3 10,3 Z" fill="#000000"></path>
                                            <rect fill="#000000" opacity="0.3" transform="translate(17.825568, 11.945519) rotate(-19.000000) translate(-17.825568, -11.945519) " x="16.3255682" y="2.94551858" width="3" height="18" rx="1"></rect>
                                        </g>
                                    </svg> </div>
                                <div class="kt-notification__item-details">
                                    <div class="kt-notification__item-title">
                                        ${el.title}
                                    </div>
                                    <div class="kt-notification__item-time">
                                        ${el.subTitle}
                                    </div>
                                </div>
                            </a>
                            `);
          } else {
            $('#addUnReadTask').append(`
                                <div href="${el.action}" target="_blank" class="kt-notification__item checkBoxNotificationRead" data-id="${el._id}">
                                <div class="kt-notification__item-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--brand">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <rect x="0" y="0" width="24" height="24"></rect>
                                            <path d="M5,3 L6,3 C6.55228475,3 7,3.44771525 7,4 L7,20 C7,20.5522847 6.55228475,21 6,21 L5,21 C4.44771525,21 4,20.5522847 4,20 L4,4 C4,3.44771525 4.44771525,3 5,3 Z M10,3 L11,3 C11.5522847,3 12,3.44771525 12,4 L12,20 C12,20.5522847 11.5522847,21 11,21 L10,21 C9.44771525,21 9,20.5522847 9,20 L9,4 C9,3.44771525 9.44771525,3 10,3 Z" fill="#000000"></path>
                                            <rect fill="#000000" opacity="0.3" transform="translate(17.825568, 11.945519) rotate(-19.000000) translate(-17.825568, -11.945519) " x="16.3255682" y="2.94551858" width="3" height="18" rx="1"></rect>
                                        </g>
                                    </svg> </div>
                                <div class="kt-notification__item-details">
                                    <div class="kt-notification__item-title">
                                        ${el.title}
                                    </div>
                                    <div class="kt-notification__item-time">
                                        ${el.subTitle}
                                    </div>
                                </div>
                            </div>
                            `);
          }
        }
        if (el.resource === 'User') {
          if (
            el.actionEffectsToId.filter((e) => e._id === userid && e.flag)
              .length > 0
          ) {
            $('#addReadUser').append(`
                            <div href="${el.action}" target="_blank"class="kt-notification__item checkBoxNotificationUnRead" data-id="${el._id}">
                            <div class="kt-notification__item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--brand">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"></rect>
                                        <path d="M5,3 L6,3 C6.55228475,3 7,3.44771525 7,4 L7,20 C7,20.5522847 6.55228475,21 6,21 L5,21 C4.44771525,21 4,20.5522847 4,20 L4,4 C4,3.44771525 4.44771525,3 5,3 Z M10,3 L11,3 C11.5522847,3 12,3.44771525 12,4 L12,20 C12,20.5522847 11.5522847,21 11,21 L10,21 C9.44771525,21 9,20.5522847 9,20 L9,4 C9,3.44771525 9.44771525,3 10,3 Z" fill="#000000"></path>
                                        <rect fill="#000000" opacity="0.3" transform="translate(17.825568, 11.945519) rotate(-19.000000) translate(-17.825568, -11.945519) " x="16.3255682" y="2.94551858" width="3" height="18" rx="1"></rect>
                                    </g>
                                </svg> </div>
                            <div class="kt-notification__item-details">
                                <div class="kt-notification__item-title">
                                    ${el.title}
                                </div>
                                <div class="kt-notification__item-time">
                                    ${el.subTitle}
                                </div>
                            </div>
                        </div>
                            `);
          } else {
            $('#addUnReadUser').append(`
    
                                <div href="${el.action}" target="_blank" class="kt-notification__item checkBoxNotificationRead" data-id="${el._id}">
                            <div class="kt-notification__item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--brand">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"></rect>
                                        <path d="M5,3 L6,3 C6.55228475,3 7,3.44771525 7,4 L7,20 C7,20.5522847 6.55228475,21 6,21 L5,21 C4.44771525,21 4,20.5522847 4,20 L4,4 C4,3.44771525 4.44771525,3 5,3 Z M10,3 L11,3 C11.5522847,3 12,3.44771525 12,4 L12,20 C12,20.5522847 11.5522847,21 11,21 L10,21 C9.44771525,21 9,20.5522847 9,20 L9,4 C9,3.44771525 9.44771525,3 10,3 Z" fill="#000000"></path>
                                        <rect fill="#000000" opacity="0.3" transform="translate(17.825568, 11.945519) rotate(-19.000000) translate(-17.825568, -11.945519) " x="16.3255682" y="2.94551858" width="3" height="18" rx="1"></rect>
                                    </g>
                                </svg> </div>
                            <div class="kt-notification__item-details">
                                <div class="kt-notification__item-title">
                                    ${el.title}
                                </div>
                                <div class="kt-notification__item-time">
                                    ${el.subTitle}
                                </div>
                            </div>
                        </div>
                            `);
          }
        }
      });
      notificationInit();
    },
    error: function (error) {
      return;
    },
  });
};

const applyFilter = (type) => {
  let table = get_table($('#kt_table_3'));
  table.ajax.url(`/notifications/all?type=${type}`).load();
};

var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    table = $('#kt_table_3').DataTable({
      //dom: 'brltip',
      orderable: false,
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      processing: true,
      serverSide: true,
      ajax: {
        url: `/notifications/all?type=all`,
        type: 'GET',
      },
      lengthMenu: [10, 25, 50, 75, 100],
      columns: [null, { data: 'title' }, { data: 'actionEffectsToId' }, null],
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
            let star = full.actionEffectsToId[0].starred
              ? 'active-star'
              : 'unactive-star';

            return `<a  class="kt-notification__item checkBoxNotificationRead">
            <div class="kt-todo__item notifications-item kt-todo__item--read" data-id="1" data-type="task">
              <div class="kt-todo__info" style="display:inline-block">
                <div class="kt-todo__actions" style="display:inline-block">
                  <label class="kt-checkbox kt-checkbox--single kt-checkbox--tick kt-checkbox--brand" style="display:inline-block">
                    <input type="checkbox" class="check siblings"/><span></span>
                  </label><span class="kt-todo__icon kt-todo__icon--on kt-todo__icon--light star-span" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Star" style="display:inline-block"><i class="flaticon-star siblings ${star}"  onClick="starredNotifications(['${full._id}'],'${meta.row}')"></i></span>
                </div>
              </div>
            </div>
          </a>
            `;
          },
        },
        {
          targets: 1,
          render: function (data, type, full, meta) {
            // let readFlag = false;
            // for (let i = 0; i < full.actionEffectsToId.length; i++) {
            //   if (full.actionEffectsToId[i].flag) {
            //     readFlag = true;
            //   }
            // }
            // return `
            //   <a href="${
            //     full.action
            //   }" target="_blank" class="kt-notification__item checkBoxNotificationRead" onclick="readNotificationTable('${
            //   full._idstarred
            // }', ${meta.row})">
            //         <div class="kt-notification__item-icon">
            //             <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--brand">
            //                 <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            //                     <rect x="0" y="0" width="24" height="24"></rect>
            //                     <path d="M5,3 L6,3 C6.55228475,3 7,3.44771525 7,4 L7,20 C7,20.5522847 6.55228475,21 6,21 L5,21 C4.44771525,21 4,20.5522847 4,20 L4,4 C4,3.44771525 4.44771525,3 5,3 Z M10,3 L11,3 C11.5522847,3 12,3.44771525 12,4 L12,20 C12,20.5522847 11.5522847,21 11,21 L10,21 C9.44771525,21 9,20.5522847 9,20 L9,4 C9,3.44771525 9.44771525,3 10,3 Z" fill="#000000"></path>
            //                     <rect fill="#000000" opacity="0.3" transform="translate(17.825568, 11.945519) rotate(-19.000000) translate(-17.825568, -11.945519) " x="16.3255682" y="2.94551858" width="3" height="18" rx="1"></rect>
            //                 </g>
            //             </svg> </div>
            //         <div class="kt-notification__item-details">
            //             <div class="kt-notification__item-title">
            //                 ${data}
            //             </div>
            //             <div class="kt-notification__item-time">
            //                 ${full.subTitle}
            //             </div>
            //             <div class="kt-notification__item-time">
            //                 on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}
            //             </div>
            //         </div>
            //     </a>
            //   `;
            if (tc.checked) {
              let check = $('.check');
              for (let i = 0; i < check.length; i++) {
                check[i].checked = true;
              }
            } else {
              let check = $('.check');
              for (let i = 0; i < check.length; i++) {
                check[i].checked = false;
              }
            }
            return `
                  <a class="kt-notification__item checkBoxNotificationRead" onclick="readNotificationTable('${full._id}', ${meta.row})">
                    <div class="kt-todo__item notifications-item kt-todo__item--read" data-id="1" data-type="task">
                      <div class="kt-todo__details" data-toggle="view" style="display:inline-block">
                        <div class="kt-todo__message" style="display:inline-block"><span class="kt-todo__subject" style="display:inline-block">${data}</span></div>
                        <div class="kt-todo__labels"><span class="kt-todo__label kt-badge kt-badge--unified-brand kt-badge--bold kt-badge--inline">${full.subTitle}</span></div>
                      </div>
                    </div>
                  </a>
                  `;
          },
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            let date = new Date(full.createdAt);
            let hrs = date.getHours();
            let mins = date.getMinutes();
            let time = 'a.m.';
            if (hrs >= 12) {
              hrs = hrs - 12;
              time = 'p.m.';
            }
            if (hrs < 10) {
              hrs = '0' + hrs;
            }
            if (mins < 10) {
              mins = '0' + mins;
            }

            var months = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ];
            // let taskRead =
            //   data.filter((e) => {
            //     if (e._id === currentuser && e.flag) {
            //       return e;
            //     }
            //   }).length > 0;
            // return taskRead
            //   ? `
            //       <span class="kt-badge kt-badge--success kt-badge--inline">Read</span>
            //     `
            //   : `<span class="kt-badge kt-badge--danger kt-badge--inline">Un-Read</span>`;
            return `
                  <a class="kt-notification__item checkBoxNotificationRead" ">
                    <div class="kt-todo__item kt-todo__item--read" data-id="1" data-type="task" >
                      <div class="kt-todo__datetime" data-toggle="view">${
                        date.getDate() +
                        ' ' +
                        months[date.getMonth()] +
                        ' ' +
                        date.getFullYear() +
                        ', ' +
                        hrs +
                        ' : ' +
                        mins +
                        ' ' +
                        time
                      }</div>
                    </div>
                  </a>
                  `;
          },
        },
        {
          targets: 3,
          render: function (data, type, full, meta) {
            var id = full.action;
            var taskkey = id.substring(100, 9)
            return `<a href="/su/task/${taskkey}" target="_blank" onclick="readNotificationTable('${full._id}', ${meta.row})"><button type="button" class="btn btn-success">Go to</button></a>`;
          },
        },
      ],
      initComplete: function (settings, json) {
        init_all_check();
      },
      rowCallback: (row, data) => {
        //Code for checking read / unread
        let readFlag = false;
        for (let i = 0; i < data.actionEffectsToId.length; i++) {
          if (data.actionEffectsToId[i].flag) {
            readFlag = true;
          }
        }
        $(row).attr('id', data._id);
        if (readFlag) {
          $(row).addClass('read');
          $(row).removeClass('unread');
        } else {
          $(row).addClass('unread');
          $(row).removeClass('read');
        }

        data.actionEffectsToId.forEach((item, index) => {
          if (index === data.actionEffectsToId.length - 1) {
            // Checking starred key of last object of array of object (actionEffectsToId) for knowing notification is starred or not
            if (data.actionEffectsToId[0].starred) {
              $(row).addClass('active-star-row');
              $(row).removeClass('unactive-star-row');
            } else if (!data.actionEffectsToId[0].starred) {
              $(row).addClass('unactive-star-row');
              $(row).removeClass('active-star-row');
            }
          }
        });
      },
      drawCallback: function (settings) {
        $('#top-check').prop('checked', false);
      },
    });

    $('#generalSearch button.search').click(function () {
      let myValue = $('#generalSearch input').val();
      table.search(myValue).draw();
    });

    $('#kt_form_type').on('change', function () {
      var val = $.fn.dataTable.util.escapeRegex($(this).val());
      table.column(1).search(val).draw();
    });

    $('#kt_form_type').selectpicker();
  };
  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    },
  };
})();

const get_table = ($table) => {
  let table = $table.DataTable();
  return table;
};

const readNotification = (id = []) => {
  let table = get_table($('#kt_table_3'));
  if (id.length === 0) {
    return bodyToast('Please select a notification');
  }
  $.ajax({
    method: 'PUT',
    url: '/notifications/read/',
    data: {
      data: id,
    },
    success: function (data) {
      table.ajax.reload(null, false);
      return;
    },
    error: function (error) {
      return;
    },
  });
};
const unReadNotification = (id = []) => {
  let table = get_table($('#kt_table_3'));
  if (id.length === 0) {
    return bodyToast('Please select a notification');
  }
  $.ajax({
    method: 'PUT',
    url: '/notifications/unread/',
    data: {
      data: id,
    },
    success: function (data) {
      table.ajax.reload(null, false);
      return;
    },
    error: function (error) {
      return;
    },
  });
};

const readNotificationTable = (id, rowNum) => {
  let table = get_table($('#kt_table_3'));
  let rowData = table.row(rowNum).data();
  let taskRead =
    rowData.actionEffectsToId.filter((e) => {
      if (e._id === currentuser && e.flag) {
        return e;
      }
    }).length > 0;
  if (taskRead) {
    return;
  }
  let idArray = [id];
  readNotification(idArray);
  table.ajax.reload();
};

const starredNotifications = (id = [], rowNum, action = undefined) => {
  let table = get_table($('#kt_table_3'));
  if (!Array.isArray(id)) {
    id = JSON.parse(id);
  }
  if (id.length === 0) {
    return bodyToast('Please select a notification');
  }
  if (id.length === 1 && !action) {
    let rowData = table.row(rowNum).data();
    action = !rowData.actionEffectsToId[0].starred;
  }

  $.ajax({
    method: 'PUT',
    url: '/notifications/starred/',
    data: {
      starred: action,
      data: [...id],
    },
    success: function (data) {
      table.ajax.reload(null, false);
      return;
    },
    error: function (error) {
      return;
    },
  });
};

const perform_action = (type) => {
  const gather_ids = [];
  switch (type) {
    case 'read':
      $('label.kt-checkbox.kt-checkbox--single input.check').each((num, el) => {
        if ($(el).prop('checked')) {
          var $selected_row = $(el).closest('tr');

          gather_ids.push($selected_row.attr('id'));
          $(el).prop('checked', false);
        }
      });
      readNotification(gather_ids);
      break;
    case 'unread':
      $('label.kt-checkbox.kt-checkbox--single input.check').each((num, el) => {
        if ($(el).prop('checked')) {
          var $selected_row = $(el).closest('tr');
          gather_ids.push($selected_row.attr('id'));
          $(el).prop('checked', false);
        }
      });
      unReadNotification(gather_ids);
      break;
    case 'starred':
      $('label.kt-checkbox.kt-checkbox--single input.check').each((num, el) => {
        if ($(el).prop('checked')) {
          var $selected_row = $(el).closest('tr');
          gather_ids.push($selected_row.attr('id'));
          $(el).prop('checked', false);
        }
      });
      starredNotifications(gather_ids, null, true);
      break;
    case 'unstarred':
      $('label.kt-checkbox.kt-checkbox--single input.check').each((num, el) => {
        if ($(el).prop('checked')) {
          var $selected_row = $(el).closest('tr');
          gather_ids.push($selected_row.attr('id'));
          $(el).prop('checked', false);
        }
      });
      starredNotifications(gather_ids, null, false);
      break;
    default:
      break;
  }
  $('#top-check').prop('checked', false);
};

// let actions = (starred, unstarred, read, unread, all) => {
//   var read = document.getElementById('read-feature');
//   var unread = document.getElementById('unread-feature');
//   var all = document.getElementById('all-feature');
//   var starred = document.getElementById('starred-feature');
//   var unstarred = document.getElementById('unstarred-feature');

//   starred.addEventListener('click', () => {
//     let tc = document.getElementById('top-check');
//     if (tc.checked) {
//       tc.checked = false;
//     }
//     let idArray = [];
//     let idArrayCounter = 0;
//     let rowArray = [];
//     let rowArrayCounter = 0;
//     let unactiveStarredRowCounter = null;
//     let check = document.getElementsByClassName('check');
//     check = [...check];
//     check.forEach((item, index) => {
//       if (item.checked) {
//         if (unactiveStarredRowCounter === null) {
//           unactiveStarredRowCounter = index;
//         }
//         let classList = item.parentElement.nextSibling.childNodes[0].classList;
//         classList.forEach((c, i) => {
//           // checking if sibling star is active or unactive
//           if (c === 'unactive-star') {
//             let id = $('.unactive-star-row')[unactiveStarredRowCounter].id;
//             unactiveStarredRowCounter++;
//             idArray[idArrayCounter] = id;
//             idArrayCounter++;
//             rowArray[rowArrayCounter] = index;
//             rowArrayCounter++;
//           }
//         });
//         item.checked = false;
//       }
//     });
//     starredNotifications(idArray, rowArray);
//   }); // undo this

//   unstarred.addEventListener('click', () => {
//     let tc = document.getElementById('top-check');
//     if (tc.checked) {
//       tc.checked = false;
//     }
//     let idArray = [];
//     let idArrayCounter = 0;
//     let rowArray = [];
//     let rowArrayCounter = 0;
//     let check = document.getElementsByClassName('check');
//     check = [...check];
//     check.forEach((item, index) => {
//       if (item.checked) {
//         let classList = item.parentElement.nextSibling.childNodes[0].classList;
//         classList.forEach((c) => {
//           // checking if sibling star is active or unactive
//           if (c === 'active-star') {
//             let id =
//               item.parentElement.parentElement.parentElement.parentElement
//                 .parentElement.parentElement.parentElement.id;
//             idArray[idArrayCounter] = id;
//             idArrayCounter++;
//             rowArray[rowArrayCounter] = index;
//             rowArrayCounter++;
//           }
//         });
//         item.checked = false;
//       }
//     });
//     starredNotifications(idArray, rowArray);
//   });

//   read.addEventListener('click', () => {
//     let tc = document.getElementById('top-check');
//     if (tc.checked) {
//       tc.checked = false;
//     }

//     let check = document.getElementsByClassName('check');
//     check = [...check];
//     let idArray = [];
//     let idArrayCounter = 0;
//     check.forEach((item, index) => {
//       if (item.checked) {
//         let status = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
//           'unread'
//         );
//         let notification =
//           item.parentElement.parentElement.parentElement.parentElement
//             .parentElement.parentElement.parentElement;
//         if (status) {
//           notification.classList.remove('unread');
//           notification.classList.add('read');
//           idArray[idArrayCounter] =
//             item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
//           idArrayCounter++;
//         }
//         item.checked = false;
//       }
//     });
//     readNotification(idArray);
//   });

//   unread.addEventListener('click', () => {
//     if (tc.checked) {
//       tc.checked = false;
//     }
//     let check = document.getElementsByClassName('check');
//     check = [...check];
//     let idArray = [];
//     let idArrayCounter = 0;
//     check.forEach((item, index) => {
//       if (item.checked) {
//         let status = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
//           'read'
//         );
//         let notification =
//           item.parentElement.parentElement.parentElement.parentElement
//             .parentElement.parentElement.parentElement;
//         if (status) {
//           notification.classList.remove('read');
//           notification.classList.add('unread');
//           idArray[idArrayCounter] =
//             item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
//           idArrayCounter++;
//         }
//         item.checked = false;
//       }
//     });
//     unReadNotification(idArray);
//   });

//   all.addEventListener('click', () => {
//     if (tc.checked) {
//       // show all read notifications
//       $('.read').css('display', 'table-row');

//       // show all unread notifications
//       $('.unread').css('display', 'table-row');
//     }
//   });
// };

$(document).ready(function () {
  //getAllNotification();
  KTDatatablesExtensionButtons.init();
  // actions(); //run now
});

// var readFilter = document.getElementById('read-filter');
// var unreadFilter = document.getElementById('unread-filter');
// var allFilter = document.getElementById('all-filter');
// var starredFilter = document.getElementById('starred-filter');
// var unstarredFilter = document.getElementById('unstarred-filter');

// unstarredFilter.addEventListener('click', () => {
//   $('.unactive-star').click(() => {
//     table.columns(0).search($(this).val()).draw();
//   })
// });
// starredFilter.addEventListener('click', () => {
//   for (let i = 0; i < $('.unactive-star').length; i++) {
//     $('.unactive-star')[
//       i
//     ].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
//       'none';
//   }
//   for (let i = 0; i < $('.active-star').length; i++) {
//     $('.active-star')[
//       i
//     ].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
//       'table-row';
//   }
// });
// allFilter.addEventListener('click', () => {
//   $('.unread').css('display', 'table-row');
//   $('.read').css('display', 'table-row');
// });
// readFilter.addEventListener('click', () => {
//   $('.unread').css('display', 'none');
//   $('.read').css('display', 'table-row');
// });

// unreadFilter.addEventListener('click', () => {
//   $('.read').css('display', 'none');
//   $('.unread').css('display', 'table-row');
// });


$('.reload').click(() => {
  let table = get_table($('#kt_table_3'));
  table.ajax.reload();
})