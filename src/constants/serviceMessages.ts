export enum ErrorCode {
  INVALID_ARGUMENT = "INVALID_ARGUMENT",
  ENUM_CONVERT = "ENUM_CONVERT",
  OPERATION_UNSUPPORTED = "OPERATION_UNSUPPORTED",
  ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
  USER_NO_ROLE = "USER_NO_ROLE",
  USER_NO_USERNAME = "USER_NO_USERNAME",
  USER_NAME_EXISTED = "USER_NAME_EXISTED",
  PASSWORD_PROVIDER_SUB_NOT_FOUND = "PASSWORD_PROVIDER_SUB_NOT_FOUND",
  ARTIST_REGISTRATION_NOT_ALLOWED = "ARTIST_REGISTRATION_NOT_ALLOWED",
  STAFF_REGISTRATION_NOT_ALLOWED = "STAFF_REGISTRATION_NOT_ALLOWED",
  PRODUCT_EXISTED = "PRODUCT_EXISTED",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  PRODUCT_CURRENCY_INVALID = "PRODUCT_CURRENCY_INVALID",
  UNAVAILABLE_PRODUCT = "UNAVAILABLE_PRODUCT",
  PAYMENT_METHOD_UNACCEPTED = "PAYMENT_METHOD_UNACCEPTED",
  LIMIT_PER_ORDER = "LIMIT_PER_ORDER",
  QUANTITY_INVALID = "QUANTITY_INVALID",
  QUANTITY_NOT_ENOUGH = "QUANTITY_NOT_ENOUGH",
  PRODUCT_INVENTORY_INFO_NOT_FOUND = "PRODUCT_INVENTORY_INFO_NOT_FOUND",
  PRODUCT_INVENTORY_OWNER_INVALID = "PRODUCT_INVENTORY_OWNER_INVALID",
  PRODUCT_IN_SALE_NOT_FOUND = "PRODUCT_IN_SALE_NOT_FOUND",
  ATTACHMENT_NOT_FOUND = "ATTACHMENT_NOT_FOUND",
  CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_NOT_ALLOWED = "USER_NOT_ALLOWED",
  USER_ADDRESS_NOT_FOUND = "USER_ADDRESS_NOT_FOUND",
  ARTIST_INFO_NOT_FOUND = "ARTIST_INFO_NOT_FOUND",
  ARTIST_NOT_FOUND = "ARTIST_NOT_FOUND",
  ARTIST_NOT_VALID = "ARTIST_NOT_VALID",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UPDATE_CART_ITEM_FAILED = "UPDATE_CART_ITEM_FAILED",
  INVALID_ITEM = "INVALID_ITEM",
  ORDER_NOT_FOUND = "ORDER_NOT_FOUND",
  ORDER_IS_NOT_ALLOWED = "ORDER_IS_NOT_ALLOWED",
  ORDER_STATUS_NOT_ALLOWED = "ORDER_STATUS_NOT_ALLOWED",
  CREATE_GHTK_ORDER_FAILED = "CREATE_GHTK_ORDER_FAILED",
  CANCEL_GHTK_ORDER_FAILED = "CANCEL_GHTK_ORDER_FAILED",
  GET_GHTK_SHIPPING_FEE_FAILED = "GET_GHTK_SHIPPING_FEE_FAILED",
  CAMPAIGN_ORDER_NOT_FOUND = "CAMPAIGN_ORDER_NOT_FOUND",
  UPDATE_CAMPAIGN_ORDER_STATUS_FAILED = "UPDATE_CAMPAIGN_ORDER_STATUS_FAILED",
  PROVIDER_NOT_FOUND = "PROVIDER_NOT_FOUND",
  PROVIDER_INFO_NOT_FOUND = "PROVIDER_INFO_NOT_FOUND",
  PROVIDER_INVALID = "PROVIDER_INVALID",
  PROVIDER_EXISTED = "PROVIDER_EXISTED",
  PROVIDED_PRODUCT_INVALID = "PROVIDED_PRODUCT_INVALID",
  REQUIRED_OPTION_NOT_FOUND = "REQUIRED_OPTION_NOT_FOUND",
  OPTION_NOT_FOUND = "OPTION_NOT_FOUND",
  OPTION_VALUE_INVALID = "OPTION_VALUE_INVALID",
  VARIANT_NOT_FOUND = "VARIANT_NOT_FOUND",
  VARIANT_INFO_NOT_FOUND = "VARIANT_INFO_NOT_FOUND",
  NOT_ALLOWED_VARIANT_UPDATED = "NOT_ALLOWED_VARIANT_UPDATED",
  CUSTOM_PRODUCT_INFO_NOT_FOUND = "CUSTOM_PRODUCT_INFO_NOT_FOUND",
  CUSTOM_PRODUCT_OWNER_INVALID = "CUSTOM_PRODUCT_OWNER_INVALID",
  UNSUPPORTED_PROVIDER = "UNSUPPORTED_PROVIDER",
  QUANTITY_RANGE_INVALID = "QUANTITY_RANGE_INVALID",
  PRICE_RANGE_INVALID = "PRICE_RANGE_INVALID",
  LOCKED_CUSTOM_PRODUCT = "LOCKED_CUSTOM_PRODUCT",
  COMBINATION_CODE_INVALID = "COMBINATION_CODE_INVALID",
  IMAGE_SET_POSITION_INVALID = "IMAGE_SET_POSITION_INVALID",
  IMAGE_SET_INVALID = "IMAGE_SET_INVALID",
  MOCKUP_IMAGE_NOT_FOUND = "MOCKUP_IMAGE_NOT_FOUND",
  MANUFACTURING_IMAGE_NOT_FOUND = "MANUFACTURING_IMAGE_NOT_FOUND",
  CUSTOM_PRODUCT_NOT_FOUND = "CUSTOM_PRODUCT_NOT_FOUND",
  UPLOAD_FAILED = "UPLOAD_FAILED",
  DOWNLOAD_FAILED = "DOWNLOAD_FAILED",
  MEDIA_NOT_FOUND = "MEDIA_NOT_FOUND",
  DOWNLOAD_NOT_ALLOWED = "DOWNLOAD_NOT_ALLOWED",
  OWNER_NOT_ALLOWED = "OWNER_NOT_ALLOWED",
  ACCOUNT_INFO_NOT_FOUND = "ACCOUNT_INFO_NOT_FOUND",
  ARTIEXH_CONFIG_ERROR = "ARTIEXH_CONFIG_ERROR",
  FINALIZED_CAMPAIGN_NOT_ALLOWED = "FINALIZED_CAMPAIGN_NOT_ALLOWED",
  CAMPAIGN_REQUEST_FINALIZED = "CAMPAIGN_REQUEST_FINALIZED",
  FINALIZED_CAMPAIGN_PRODUCT_VALIDATION = "FINALIZED_CAMPAIGN_PRODUCT_VALIDATION",
  PRODUCT_CAMPAIGN_INFO_NOT_FOUND = "PRODUCT_CAMPAIGN_INFO_NOT_FOUND",
  PRODUCT_CAMPAIGN_QUANTITY_VALIDATION = "PRODUCT_CAMPAIGN_QUANTITY_VALIDATION",
  PRODUCT_CAMPAIGN_PRICE_VALIDATION = "PRODUCT_CAMPAIGN_PRICE_VALIDATION",
  PRODUCT_CAMPAIGN_VALIDATION = "PRODUCT_CAMPAIGN_VALIDATION",
  FROM_TO_VALIDATION = "FROM_TO_VALIDATION",
  UPDATE_CAMPAIGN_STATUS_FAILED = "UPDATE_CAMPAIGN_STATUS_FAILED",
  CAMPAIGN_UNPUBLISHED = "CAMPAIGN_UNPUBLISHED",
  CAMPAIGN_REQUEST_NOT_FOUND = "CAMPAIGN_REQUEST_NOT_FOUND",
  CAMPAIGN_REQUEST_NOT_FINALIZED = "CAMPAIGN_REQUEST_NOT_FINALIZED",
  CAMPAIGN_REQUEST_USED = "CAMPAIGN_REQUEST_USED",
  PRODUCT_FINALIZED_NOT_ENOUGH = "PRODUCT_FINALIZED_NOT_ENOUGH",
  CAMPAIGN_OWNER_INVALID = "CAMPAIGN_OWNER_INVALID",
  INVALID_PUBLIC_CAMPAIGN_OWNER = "INVALID_PUBLIC_CAMPAIGN_OWNER",
  UPDATE_CAMPAIGN_REQUEST = "UPDATE_CAMPAIGN_REQUEST",
  CAMPAIGN_SALE_UNOPENED = "CAMPAIGN_SALE_UNOPENED",
  ADD_PRODUCT_CAMPAIGN_SALE_FAILED = "ADD_PRODUCT_CAMPAIGN_SALE_FAILED",
  ADD_PRODUCT_CAMPAIGN_SALE_FROM_REQUEST_FAILED = "ADD_PRODUCT_CAMPAIGN_SALE_FROM_REQUEST_FAILED",
  DELETE_PRODUCT_CAMPAIGN_SALE_FAILED = "DELETE_PRODUCT_CAMPAIGN_SALE_FAILED",
  DELETE_PRODUCT_CAMPAIGN_SALE_FROM_REQUEST_FAILED = "DELETE_PRODUCT_CAMPAIGN_SALE_FROM_REQUEST_FAILED",
  UPDATE_SALE_CAMPAIGN_FAILED = "UPDATE_SALE_CAMPAIGN_FAILED",
  PUBLIC_DATE_INVALID = "PUBLIC_DATE_INVALID",
  UPDATE_FROM_FAILED = "UPDATE_FROM_FAILED",
  UPDATE_PUBLIC_DATE_FAILED = "UPDATE_PUBLIC_DATE_FAILED",
  FROM_DATE_INVALID = "FROM_DATE_INVALID",
  NOT_ALLOWED_OWNER_UPDATED = "NOT_ALLOWED_OWNER_UPDATED",
  NOT_ALLOWED_CLOSED_CAMPAIGN = "NOT_ALLOWED_CLOSED_CAMPAIGN",
  OWNER_NOT_FOUND = "OWNER_NOT_FOUND",
  CAMPAIGN_SALE_NOT_FOUND = "CAMPAIGN_SALE_NOT_FOUND",
}

export const errorMessages = {
  INVALID_ARGUMENT: {
    title: "Lỗi đối số không hợp lệ",
    description: "Lỗi đối số không hợp lệ",
  },
  ENUM_CONVERT: {
    title: "Chuyển đổi ENUM không hợp lệ",
    description: "Chuyển đổi ENUM không hợp lệ",
  },
  OPERATION_UNSUPPORTED: {
    title: "Thao tác không được hỗ trợ",
    description: "Thao tác không được hỗ trợ",
  },
  ENTITY_NOT_FOUND: {
    title: "Không tìm thấy thực thể",
    description: "Không tìm thấy thực thể",
  },
  USER_NO_ROLE: {
    title: "Người dùng không có vai trò",
    description: "Người dùng không có vai trò",
  },
  USER_NO_USERNAME: {
    title: "Người dùng không có tên người dùng",
    description: "Người dùng không có tên người dùng",
  },
  USER_NAME_EXISTED: {
    title: "Tên người dùng đã tồn tại",
    description: "Tên người dùng đã tồn tại",
  },
  PASSWORD_PROVIDER_SUB_NOT_FOUND: {
    title: "Không tìm thấy đăng ký cung cấp mật khẩu",
    description: "Không tìm thấy đăng ký cung cấp mật khẩu",
  },
  ARTIST_REGISTRATION_NOT_ALLOWED: {
    title: "Đăng ký nghệ sĩ không được phép",
    description: "Đăng ký nghệ sĩ không được phép",
  },
  STAFF_REGISTRATION_NOT_ALLOWED: {
    title: "Đăng ký nhân viên không được phép",
    description: "Đăng ký nhân viên không được phép",
  },
  PRODUCT_EXISTED: {
    title: "Sản phẩm đã tồn tại",
    description: "Sản phẩm đã tồn tại",
  },
  PRODUCT_NOT_FOUND: {
    title: "Không tìm thấy sản phẩm",
    description: "Không tìm thấy sản phẩm",
  },
  PRODUCT_CURRENCY_INVALID: {
    title: "Loại tiền tệ sản phẩm không hợp lệ",
    description: "Loại tiền tệ sản phẩm không hợp lệ",
  },
  UNAVAILABLE_PRODUCT: {
    title: "Sản phẩm không khả dụng",
    description: "Sản phẩm không khả dụng",
  },
  PAYMENT_METHOD_UNACCEPTED: {
    title: "Phương thức thanh toán không được chấp nhận",
    description: "Phương thức thanh toán không được chấp nhận",
  },
  LIMIT_PER_ORDER: {
    title: "Giới hạn mỗi đơn hàng",
    description: "Giới hạn mỗi đơn hàng",
  },
  QUANTITY_INVALID: {
    title: "Số lượng không hợp lệ",
    description: "Số lượng không hợp lệ",
  },
  QUANTITY_NOT_ENOUGH: {
    title: "Số lượng không đủ",
    description: "Số lượng không đủ",
  },
  PRODUCT_INVENTORY_INFO_NOT_FOUND: {
    title: "Không tìm thông tin tồn kho sản phẩm",
    description: "Không tìm thông tin tồn kho sản phẩm",
  },
  PRODUCT_INVENTORY_OWNER_INVALID: {
    title: "Chủ sở hữu tồn kho sản phẩm không hợp lệ",
    description: "Chủ sở hữu tồn kho sản phẩm không hợp lệ",
  },
  PRODUCT_IN_SALE_NOT_FOUND: {
    title: "Không tìm trong danh sách sản phẩm đang bán",
    description: "Không tìm trong danh sách sản phẩm đang bán",
  },
  ATTACHMENT_NOT_FOUND: {
    title: "Không tìm thấy tệp đính kèm",
    description: "Không tìm thấy tệp đính kèm",
  },
  CATEGORY_NOT_FOUND: {
    title: "Không tìm thấy danh mục",
    description: "Không tìm thấy danh mục",
  },
  USER_NOT_FOUND: {
    title: "Không tìm thấy người dùng",
    description: "Không tìm thấy người dùng",
  },
  USER_NOT_ALLOWED: {
    title: "Người dùng không được phép",
    description: "Người dùng không được phép",
  },
  USER_ADDRESS_NOT_FOUND: {
    title: "Không tìm thấy địa chỉ người dùng",
    description: "Không tìm thấy địa chỉ người dùng",
  },
  ARTIST_INFO_NOT_FOUND: {
    title: "Không tìm thông tin nghệ sĩ",
    description: "Không tìm thông tin nghệ sĩ",
  },
  ARTIST_NOT_FOUND: {
    title: "Không tìm thấy nghệ sĩ",
    description: "Không tìm thấy nghệ sĩ",
  },
  ARTIST_NOT_VALID: {
    title: "Nghệ sĩ không hợp lệ",
    description: "Nghệ sĩ không hợp lệ",
  },
  POST_NOT_FOUND: {
    title: "Không tìm thấy bài đăng",
    description: "Không tìm thấy bài đăng",
  },
  UPDATE_CART_ITEM_FAILED: {
    title: "Cập nhật mục giỏ hàng thất bại",
    description: "Cập nhật mục giỏ hàng thất bại",
  },
  INVALID_ITEM: {
    title: "Mục không hợp lệ",
    description: "Mục không hợp lệ",
  },
  ORDER_NOT_FOUND: {
    title: "Không tìm thấy đơn hàng",
    description: "Không tìm thấy đơn hàng",
  },
  ORDER_IS_NOT_ALLOWED: {
    title: "Đơn hàng không được phép",
    description: "Đơn hàng không được phép",
  },
  ORDER_STATUS_NOT_ALLOWED: {
    title: "Trạng thái đơn hàng không được phép",
    description: "Trạng thái đơn hàng không được phép",
  },
  CREATE_GHTK_ORDER_FAILED: {
    title: "Tạo đơn hàng GHTK thất bại",
    description: "Tạo đơn hàng GHTK thất bại",
  },
  CANCEL_GHTK_ORDER_FAILED: {
    title: "Hủy đơn hàng GHTK thất bại",
    description: "Hủy đơn hàng GHTK thất bại",
  },
  GET_GHTK_SHIPPING_FEE_FAILED: {
    title: "Lấy phí vận chuyển GHTK thất bại",
    description: "Lấy phí vận chuyển GHTK thất bại",
  },
  CAMPAIGN_ORDER_NOT_FOUND: {
    title: "Không tìm thấy đơn hàng chiến dịch",
    description: "Không tìm thấy đơn hàng chiến dịch",
  },
  UPDATE_CAMPAIGN_ORDER_STATUS_FAILED: {
    title: "Cập nhật trạng thái đơn hàng chiến dịch thất bại",
    description: "Cập nhật trạng thái đơn hàng chiến dịch thất bại",
  },
  PROVIDER_NOT_FOUND: {
    title: "Không tìm thấy nhà cung cấp",
    description: "Không tìm thấy nhà cung cấp",
  },
  PROVIDER_INFO_NOT_FOUND: {
    title: "Không tìm thông tin nhà cung cấp",
    description: "Không tìm thông tin nhà cung cấp",
  },
  PROVIDER_INVALID: {
    title: "Nhà cung cấp không hợp lệ",
    description: "Nhà cung cấp không hợp lệ",
  },
  PROVIDER_EXISTED: {
    title: "Nhà cung cấp đã tồn tại",
    description: "Nhà cung cấp đã tồn tại",
  },
  PROVIDED_PRODUCT_INVALID: {
    title: "Sản phẩm cung cấp không hợp lệ",
    description: "Sản phẩm cung cấp không hợp lệ",
  },
  REQUIRED_OPTION_NOT_FOUND: {
    title: "Không tìm thấy tùy chọn bắt buộc",
    description: "Không tìm thấy tùy chọn bắt buộc",
  },
  OPTION_NOT_FOUND: {
    title: "Không tìm thấy tùy chọn",
    description: "Không tìm thấy tùy chọn",
  },
  OPTION_VALUE_INVALID: {
    title: "Giá trị tùy chọn không hợp lệ",
    description: "Giá trị tùy chọn không hợp lệ",
  },
  VARIANT_NOT_FOUND: {
    title: "Không tìm thấy biến thể",
    description: "Không tìm thấy biến thể",
  },
  VARIANT_INFO_NOT_FOUND: {
    title: "Không tìm thông tin biến thể",
    description: "Không tìm thông tin biến thể",
  },
  NOT_ALLOWED_VARIANT_UPDATED: {
    title: "Không cho phép cập nhật biến thể",
    description: "Không cho phép cập nhật biến thể",
  },
  CUSTOM_PRODUCT_INFO_NOT_FOUND: {
    title: "Không tìm thông tin sản phẩm tùy chỉnh",
    description: "Không tìm thông tin sản phẩm tùy chỉnh",
  },
  CUSTOM_PRODUCT_OWNER_INVALID: {
    title: "Chủ sở hữu sản phẩm tùy chỉnh không hợp lệ",
    description: "Chủ sở hữu sản phẩm tùy chỉnh không hợp lệ",
  },
  UNSUPPORTED_PROVIDER: {
    title: "Nhà cung cấp không được hỗ trợ",
    description: "Nhà cung cấp không được hỗ trợ",
  },
  QUANTITY_RANGE_INVALID: {
    title: "Số lượng không hợp lệ",
    description: "Số lượng không hợp lệ",
  },
  PRICE_RANGE_INVALID: {
    title: "Giá không hợp lệ",
    description: "Giá không hợp lệ",
  },
  LOCKED_CUSTOM_PRODUCT: {
    title: "Sản phẩm tùy chỉnh bị khóa",
    description: "Sản phẩm tùy chỉnh bị khóa",
  },
  COMBINATION_CODE_INVALID: {
    title: "Mã kết hợp không hợp lệ",
    description: "Mã kết hợp không hợp lệ",
  },
  IMAGE_SET_POSITION_INVALID: {
    title: "Vị trí bộ hình ảnh không hợp lệ",
    description: "Vị trí bộ hình ảnh không hợp lệ",
  },
  IMAGE_SET_INVALID: {
    title: "Bộ hình ảnh không hợp lệ",
    description: "Bộ hình ảnh không hợp lệ",
  },
  MOCKUP_IMAGE_NOT_FOUND: {
    title: "Không tìm hình ảnh mẫu",
    description: "Không tìm hình ảnh mẫu",
  },
  MANUFACTURING_IMAGE_NOT_FOUND: {
    title: "Không tìm hình ảnh sản xuất",
    description: "Không tìm hình ảnh sản xuất",
  },
  CUSTOM_PRODUCT_NOT_FOUND: {
    title: "Không tìm sản phẩm tùy chỉnh",
    description: "Không tìm sản phẩm tùy chỉnh",
  },
  UPLOAD_FAILED: {
    title: "Tải lên thất bại",
    description: "Tải lên thất bại",
  },
  DOWNLOAD_FAILED: {
    title: "Tải xuống thất bại",
    description: "Tải xuống thất bại",
  },
  MEDIA_NOT_FOUND: {
    title: "Không tìm đa phương tiện",
    description: "Không tìm đa phương tiện",
  },
  DOWNLOAD_NOT_ALLOWED: {
    title: "Tải xuống không được phép",
    description: "Tải xuống không được phép",
  },
  OWNER_NOT_ALLOWED: {
    title: "Chủ sở hữu không được phép",
    description: "Chủ sở hữu không được phép",
  },
  ACCOUNT_INFO_NOT_FOUND: {
    title: "Không tìm thông tin tài khoản",
    description: "Không tìm thông tin tài khoản",
  },
  ARTIEXH_CONFIG_ERROR: {
    title: "Lỗi cấu hình ARTIEXH",
    description: "Lỗi cấu hình ARTIEXH",
  },
  FINALIZED_CAMPAIGN_NOT_ALLOWED: {
    title: "Chiến dịch đã hoàn thành không được phép",
    description: "Chiến dịch đã hoàn thành không được phép",
  },
  CAMPAIGN_REQUEST_FINALIZED: {
    title: "Yêu cầu chiến dịch đã hoàn thành",
    description: "Yêu cầu chiến dịch đã hoàn thành",
  },
  FINALIZED_CAMPAIGN_PRODUCT_VALIDATION: {
    title: "Kiểm tra hợp lệ sản phẩm chiến dịch đã hoàn thành",
    description: "Kiểm tra hợp lệ sản phẩm chiến dịch đã hoàn thành",
  },
  PRODUCT_CAMPAIGN_INFO_NOT_FOUND: {
    title: "Không tìm thông tin chiến dịch sản phẩm",
    description: "Không tìm thông tin chiến dịch sản phẩm",
  },
  PRODUCT_CAMPAIGN_QUANTITY_VALIDATION: {
    title: "Kiểm tra hợp lệ số lượng chiến dịch sản phẩm",
    description: "Kiểm tra hợp lệ số lượng chiến dịch sản phẩm",
  },
  PRODUCT_CAMPAIGN_PRICE_VALIDATION: {
    title: "Kiểm tra hợp lệ giá chiến dịch sản phẩm",
    description: "Kiểm tra hợp lệ giá chiến dịch sản phẩm",
  },
  PRODUCT_CAMPAIGN_VALIDATION: {
    title: "Kiểm tra hợp lệ chiến dịch sản phẩm",
    description: "Kiểm tra hợp lệ chiến dịch sản phẩm",
  },
  FROM_TO_VALIDATION: {
    title: "Kiểm tra hợp lệ từ đến",
    description: "Kiểm tra hợp lệ từ đến",
  },
  UPDATE_CAMPAIGN_STATUS_FAILED: {
    title: "Cập nhật trạng thái chiến dịch thất bại",
    description: "Cập nhật trạng thái chiến dịch thất bại",
  },
  CAMPAIGN_UNPUBLISHED: {
    title: "Chiến dịch chưa công bố",
    description: "Chiến dịch chưa công bố",
  },
  CAMPAIGN_REQUEST_NOT_FOUND: {
    title: "Không tìm thấy yêu cầu chiến dịch",
    description: "Không tìm thấy yêu cầu chiến dịch",
  },
  CAMPAIGN_REQUEST_NOT_FINALIZED: {
    title: "Yêu cầu chiến dịch chưa hoàn thành",
    description: "Yêu cầu chiến dịch chưa hoàn thành",
  },
  CAMPAIGN_REQUEST_USED: {
    title: "Yêu cầu chiến dịch đã sử dụng",
    description: "Yêu cầu chiến dịch đã sử dụng",
  },
  PRODUCT_FINALIZED_NOT_ENOUGH: {
    title: "Sản phẩm đã hoàn thành không đủ",
    description: "Sản phẩm đã hoàn thành không đủ",
  },
  CAMPAIGN_OWNER_INVALID: {
    title: "Chủ sở hữu chiến dịch không hợp lệ",
    description: "Chủ sở hữu chiến dịch không hợp lệ",
  },
  INVALID_PUBLIC_CAMPAIGN_OWNER: {
    title: "Chủ sở hữu chiến dịch công cộng không hợp lệ",
    description: "Chủ sở hữu chiến dịch công cộng không hợp lệ",
  },
  UPDATE_CAMPAIGN_REQUEST: {
    title: "Cập nhật yêu cầu chiến dịch",
    description: "Cập nhật yêu cầu chiến dịch",
  },
  CAMPAIGN_SALE_UNOPENED: {
    title: "Bán hàng chiến dịch chưa mở",
    description: "Bán hàng chiến dịch chưa mở",
  },
  ADD_PRODUCT_CAMPAIGN_SALE_FAILED: {
    title: "Thêm sản phẩm bán hàng chiến dịch thất bại",
    description: "Thêm sản phẩm bán hàng chiến dịch thất bại",
  },
  ADD_PRODUCT_CAMPAIGN_SALE_FROM_REQUEST_FAILED: {
    title: "Thêm sản phẩm bán hàng chiến dịch từ yêu cầu thất bại",
    description: "Thêm sản phẩm bán hàng chiến dịch từ yêu cầu thất bại",
  },
  DELETE_PRODUCT_CAMPAIGN_SALE_FAILED: {
    title: "Xóa sản phẩm bán hàng chiến dịch thất bại",
    description: "Xóa sản phẩm bán hàng chiến dịch thất bại",
  },
  DELETE_PRODUCT_CAMPAIGN_SALE_FROM_REQUEST_FAILED: {
    title: "Xóa sản phẩm bán hàng chiến dịch từ yêu cầu thất bại",
    description: "Xóa sản phẩm bán hàng chiến dịch từ yêu cầu thất bại",
  },
  UPDATE_SALE_CAMPAIGN_FAILED: {
    title: "Cập nhật bán hàng chiến dịch thất bại",
    description: "Cập nhật bán hàng chiến dịch thất bại",
  },
  PUBLIC_DATE_INVALID: {
    title: "Ngày công bố không hợp lệ",
    description: "Ngày công bố không hợp lệ",
  },
  UPDATE_FROM_FAILED: {
    title: "Cập nhật từ thất bại",
    description: "Cập nhật từ thất bại",
  },
  UPDATE_PUBLIC_DATE_FAILED: {
    title: "Cập nhật ngày công bố thất bại",
    description: "Cập nhật ngày công bố thất bại",
  },
  FROM_DATE_INVALID: {
    title: "Ngày từ không hợp lệ",
    description: "Ngày từ không hợp lệ",
  },
  NOT_ALLOWED_OWNER_UPDATED: {
    title: "Không cho phép cập nhật chủ sở hữu",
    description: "Không cho phép cập nhật chủ sở hữu",
  },
  NOT_ALLOWED_CLOSED_CAMPAIGN: {
    title: "Không cho phép chiến dịch đã đóng",
    description: "Không cho phép chiến dịch đã đóng",
  },
  OWNER_NOT_FOUND: {
    title: "Không tìm thấy chủ sở hữu",
    description: "Không tìm thấy chủ sở hữu",
  },
  CAMPAIGN_SALE_NOT_FOUND: {
    title: "Không tìm thấy bán hàng chiến dịch",
    description: "Không tìm thấy bán hàng chiến dịch",
  },
};

//exa
export const successMessages = { a: "eabhe" };
