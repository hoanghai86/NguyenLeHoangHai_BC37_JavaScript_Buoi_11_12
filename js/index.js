var userList = [];
var userListTeacher = [];

//hàm có chức năng in người dùng ra màn hình
//tạo HTML trong javascript
function renderUser(data) {
  //nếu không truyền mảng data nào thì ta gán mặc định là mảng userList
  if (!data) data = userList;
  var tableHTML = "";
  for (var i = 0; i < data.length; i++) {
    var currentUser = data[i];
    tableHTML += `<tr>
    <td>${currentUser.id}</td>
    <td>${currentUser.taiKhoan}</td>
    <td>${currentUser.matKhau}</td>
    <td>${currentUser.hoTen}</td>
    <td>${currentUser.email}</td>
    <td>${currentUser.ngonNgu}</td>
    <td>${currentUser.loaiND}</td>
    <td><button class = "btn btn-danger" onclick="deleteUser('${currentUser.id}')">Xóa</button>
    <button class = "btn btn-info" data-toggle="modal"
    data-target="#myModal" onclick="getUpdateUser('${currentUser.id}')">Sửa</button></td>
    </tr>`;
  }
  document.getElementById("tblDanhSachNguoiDung").innerHTML = tableHTML;
}

//hàm có chức năng in danh sách giáo viên ra màn hình
//tạo HTML trong javascript
function renderTeacher(data) {
  if (!data) data = userListTeacher;
  var tableHTML = "";
  for (var i = 0; i < data.length; i++) {
    var currentUser = data[i];
    tableHTML += `<tr>
    <td>${currentUser.id}</td>
    <td>${currentUser.taiKhoan}</td>
    <td>${currentUser.matKhau}</td>
    <td>${currentUser.hoTen}</td>
    <td>${currentUser.email}</td>
    <td>${currentUser.ngonNgu}</td>
    <td>${currentUser.loaiND}</td>
    <td><button class = "btn btn-danger" onclick="deleteUser('${currentUser.id}')">Xóa</button>
    <button class = "btn btn-info" data-toggle="modal"
    data-target="#myModal" onclick="getUpdateUser('${currentUser.id}')">Sửa</button></td>
    </tr>`;
  }
  document.getElementById("tblDanhSachGiaoVien").innerHTML = tableHTML;
}

//hàm có chức năng lấy danh sách người dùng lên giao diện
function getUserList() {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User",
    method: "GET",
  })
    .then(function (res) {
      userList = res.data;
      renderUser();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng lấy danh sách giáo viên lên giao diện
function getTeacherList() {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User",
    method: "GET",
  })
    .then(function (res) {
      userList = res.data;

      userListTeacher = [];
      for (var i = 0; i < userList.length; i++) {
        var loaiND = userList[i].loaiND;
        if (loaiND.includes("GV")) {
          userListTeacher.push(userList[i]);
        }
      }
      renderTeacher();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//Hàm có chức năng thêm người dùng vào database
function createUser() {
  //kiểm tra thông tin đầu vào
  var isFormValid = validateForm();
  if (!isFormValid) return;

  //Lấy thông tin người dùng nhập vô
  var taiKhoan = document.getElementById("TaiKhoan").value;
  var hoTen = document.getElementById("HoTen").value;
  var matKhau = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var loaiND = document.getElementById("loaiNguoiDung").value;
  var ngonNgu = document.getElementById("loaiNgonNgu").value;
  var moTa = document.getElementById("MoTa").value;
  var hinhAnh = document.getElementById("HinhAnh").value;

  //tạo 1 object đối tượng người dùng
  var newUser = new User(
    taiKhoan,
    hoTen,
    matKhau,
    email,
    loaiND,
    ngonNgu,
    moTa,
    hinhAnh
  );

  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User",
    method: "POST",
    data: newUser,
  })
    .then(function (res) {
      getUserList();
      document.getElementById("btnDong").click();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng xóa user trong danh sách, có dấu "/"
function deleteUser(id) {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User/" + id,
    method: "DELETE",
  })
    .then(function () {
      getUserList();
      getTeacherList();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng tìm kiếm theo nhóm user (GV, HV...)
function searchUser() {
  var keyword = document
    .getElementById("searchName")
    .value.toLowerCase()
    .trim();

  var search = [];
  for (var i = 0; i < userList.length; i++) {
    var taiKhoan = userList[i].taiKhoan.toLowerCase();
    var hoTen = userList[i].hoTen.toLowerCase();
    if (taiKhoan === keyword || hoTen.includes(keyword)) {
      search.push(userList[i]);
    }
  }
  renderUser(search);
}

//hàm có chức năng tìm kiếm giáo viên
function searchTeacher() {
  var keyword = document
    .getElementById("searchTeacher")
    .value.toLowerCase()
    .trim();
  var searchTeacher = [];
  for (var i = 0; i < userListTeacher.length; i++) {
    var taiKhoan = userListTeacher[i].taiKhoan.toLowerCase();
    var hoTen = userListTeacher[i].hoTen.toLowerCase();
    if (taiKhoan === keyword || hoTen.includes(keyword)) {
      searchTeacher.push(userListTeacher[i]);
    }
  }
  renderTeacher(searchTeacher);
}

//hàm có chức năng lấy thông tin user cần sửa lên form modal
function getUpdateUser(id) {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User/" + id,
    method: "GET",
  })
    .then(function (res) {
      var user = res.data;
      //lấy thông tin đối tượng lên giao diện form modal
      document.getElementById("id").value = user.id;
      document.getElementById("TaiKhoan").value = user.taiKhoan;
      document.getElementById("HoTen").value = user.hoTen;
      document.getElementById("MatKhau").value = user.matKhau;
      document.getElementById("Email").value = user.email;
      document.getElementById("loaiNguoiDung").value = user.loaiND;
      document.getElementById("loaiNgonNgu").value = user.ngonNgu;
      document.getElementById("MoTa").value = user.moTa;
      document.getElementById("HinhAnh").value = user.hinhAnh;

      document.getElementById("TaiKhoan").disabled = true; //không cho user sửa mã tài khoản
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng update thông tin user
function updateUser() {
  //kiểm tra thông tin đầu vào
  var isFormValid = validateUpdateForm();
  if (!isFormValid) return;

  //Lấy thông tin người dùng nhập vô
  var id = document.getElementById("id").value;
  var taiKhoan = document.getElementById("TaiKhoan").value;
  var hoTen = document.getElementById("HoTen").value;
  var matKhau = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var loaiND = document.getElementById("loaiNguoiDung").value;
  var ngonNgu = document.getElementById("loaiNgonNgu").value;
  var moTa = document.getElementById("MoTa").value;
  var hinhAnh = document.getElementById("HinhAnh").value;

  //tạo đối tượng user mới, đây là đối tượng sau khi đã chỉnh sửa
  var newUser = new User(
    taiKhoan,
    hoTen,
    matKhau,
    email,
    loaiND,
    ngonNgu,
    moTa,
    hinhAnh
  );

  //gửi đối tượng này xuống backend
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User/" + id,
    method: "PUT",
    data: newUser,
  })
    .then(function () {
      getUserList();
      getTeacherList();
      document.getElementById("btnDong").click();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//VALIDATION FORM
//không được trống
function require(val, spanId) {
  if (val.length === 0) {
    document.getElementById(spanId).innerHTML = "*Trường này bắt buộc nhập !!!";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
}

//kiểm tra không được trùng mã tài khoản
function checkTaiKhoan(val, spanId) {
  for (i = 0; i < userList.length; i++) {
    if (userList[i].taiKhoan === val) {
      document.getElementById(spanId).innerHTML = "*Tài khoản bị trùng !!!";
      return false;
    }
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
}

//kiểm tra độ dài ký tự
function checkLength(val, spanId, min, max) {
  if (val.length < min || val.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} ký tự`;
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
}

//kiểm tra họ tên không chứa ký tự đặc biệt
function checkName(val, spanId) {
  var pattern =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/g;

  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML = "*Trường này chỉ được gõ chữ !!!";
  return false;
}

//kiểm tra định dạng mật khẩu (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt))
function checkStringPassword(val, spanId) {
  var pattern =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-z0-9!@#$%^&*]{6,10}$/g;
  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML =
    "*Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt !!!";
}

//kiểm tra định dạng email
function checkStringEmail(val, spanId) {
  var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML =
    "*Vui lòng nhập đúng định dạng email";
}

//hàm có chức năng kiểm tra thông tin khi tạo mới 1 người dùng
function validateForm() {
  var taiKhoan = document.getElementById("TaiKhoan").value;
  var hoTen = document.getElementById("HoTen").value;
  var matKhau = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var hinhAnh = document.getElementById("HinhAnh").value;
  var loaiND = document.getElementById("loaiNguoiDung").value;
  var ngonNgu = document.getElementById("loaiNgonNgu").value;
  var moTa = document.getElementById("MoTa").value;

  var isValid = true;
  isValid &=
    require(taiKhoan, "tbTaiKhoan") && checkTaiKhoan(taiKhoan, "tbTaiKhoan");
  isValid &= require(hoTen, "tbHoTen") && checkName(hoTen, "tbHoTen");
  isValid &=
    require(matKhau, "tbMatKhau") &&
    checkLength(matKhau, "tbMatKhau", 6, 8) &&
    checkStringPassword(matKhau, "tbMatKhau");
  isValid &= require(email, "tbEmail") && checkStringEmail(email, "tbEmail");
  isValid &= require(hinhAnh, "tbHinhAnh");
  isValid &= require(loaiND, "tbloaiNguoiDung");
  isValid &= require(ngonNgu, "tbloaiNgonNgu");
  isValid &= require(moTa, "tbMoTa") && checkLength(moTa, "tbMoTa", 0, 60);
  return isValid;
}

//hàm có chức năng kiểm tra thông tin khi update 1 người dùng
function validateUpdateForm() {
  var hoTen = document.getElementById("HoTen").value;
  var matKhau = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var hinhAnh = document.getElementById("HinhAnh").value;
  var loaiND = document.getElementById("loaiNguoiDung").value;
  var ngonNgu = document.getElementById("loaiNgonNgu").value;
  var moTa = document.getElementById("MoTa").value;

  var isValid = true;
  isValid &= require(hoTen, "tbHoTen") && checkName(hoTen, "tbHoTen");
  isValid &=
    require(matKhau, "tbMatKhau") &&
    checkLength(matKhau, "tbMatKhau", 6, 8) &&
    checkStringPassword(matKhau, "tbMatKhau");
  isValid &= require(email, "tbEmail") && checkStringEmail(email, "tbEmail");
  isValid &= require(hinhAnh, "tbHinhAnh");
  isValid &= require(loaiND, "tbloaiNguoiDung");
  isValid &= require(ngonNgu, "tbloaiNgonNgu");
  isValid &= require(moTa, "tbMoTa") && checkLength(moTa, "tbMoTa", 0, 60);
  return isValid;
}

//hàm có chức năng reset form modal
function resetInputFormModal() {
  document.getElementById("btnReset").click();
  document.getElementById("tbTaiKhoan").innerHTML = "";
  document.getElementById("tbHoTen").innerHTML = "";
  document.getElementById("tbMatKhau").innerHTML = "";
  document.getElementById("tbEmail").innerHTML = "";
  document.getElementById("tbHinhAnh").innerHTML = "";
  document.getElementById("tbloaiNguoiDung").innerHTML = "";
  document.getElementById("tbloaiNgonNgu").innerHTML = "";
  document.getElementById("tbMoTa").innerHTML = "";
}

window.onload = function () {
  getUserList();
  getTeacherList();
};
