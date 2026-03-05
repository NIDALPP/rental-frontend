import React, { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../../services/cloudinary";
import { Home, DollarSign, MapPin, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { addProperty } from "../../services/propertyStore";

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  address: z.object({
    street: z.string().min(2, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
    country: z.string().min(2, "Country must be at least 2 characters"),
  }),
  price: z.coerce.number().positive("Price must be positive"),
  bedrooms: z.coerce.number().positive("Bedrooms must be positive"),
  bathrooms: z.coerce.number().positive("Bathrooms must be positive"),
  sqft: z.coerce.number().positive("Square feet must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["Apartment", "House", "flat"], "Select a valid property type"),
  isFurnished: z.preprocess(
    (value) => value === "true" || value === true,
    z.boolean()
  ),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  amenities: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

let defaultValues = {
  title: "test",
  address: {
    street: "testt",
    city: "test",
    state: "test",
    zipCode: "12345",
    country: "test",
  },
  price: "3000",
  bedrooms: "2",
  bathrooms: "2",
  sqft: "1000",
  description: "Test property description",
  type: "Apartment",
  isFurnished: true,
  images: [],
  amenities: [],
  thumbnail: "",
};

const propertyTypeOptions = ["Apartment", "House", "flat"];
const amenitiesOptions = [
  "Parking",
  "Gym",
  "Pool",
  "Security",
  "Elevator",
  "Pet Friendly",
  "Balcony",
  "Furnished",
];

const AddPropertyForm = ({
  images = [],
  isUploadingImage,
  imageUploadError,
  onCancel,
  onImageSelect,
  onImageRemove,
}) => {
  // Thumbnail uploader state
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState("");
  // Thumbnail upload handler
  const handleThumbnailSelect = async (event) => {
    const [file] = event.target.files || [];
    setSelectedThumbnailFile(file || null);
    setThumbnailUploadError("");
    if (!file) return;
    try {
      setIsUploadingThumbnail(true);
      setThumbnailUploadError("");
      const uploadedUrl = await uploadImageToCloudinary(file);
      setThumbnailUrl(uploadedUrl);
    } catch (error) {
      setThumbnailUploadError(error.message || "Failed to upload thumbnail.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(propertySchema),
  });

  const [isAmenitiesDropdownOpen, setIsAmenitiesDropdownOpen] = useState(false);
  const selectedAmenities = watch("amenities") || [];

  const toggleAmenity = (amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];

    setValue("amenities", updatedAmenities, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
    if (!images.length) {
      toast.error("Please upload at least one property image");
      return;
    }
    if (!thumbnailUrl) {
      toast.error("Please provide a thumbnail for the property");
      return;
    }
    try {
      // Mock API delay
      //   const location = [
      //     data.address.street,
      //     data.address.city,
      //     data.address.state,
      //     data.address.country,
      //   ]
      // .filter(Boolean)
      // .join(", ");

      //   const newPropertyData = {
      //     title: data.title,
      //     address: location,
      //     type: data.type,
      //     isFurnished: data.isFurnished,
      //     address: {
      //       street: data.address.street,
      //       city: data.address.city,
      //       state: data.address.state,
      //       zipCode: data.address.zipCode,
      //       country: data.address.country,
      //     },
      //     price: Number(data.price),
      //     bedrooms: Number(data.bedrooms),
      //     bathrooms: Number(data.bathrooms),
      //     sqft: Number(data.sqft),
      //     description: data.description,
      //     images: images,
      //     thumbnail: thumbnailUrl,
      //     amenities: data.amenities?.length
      //       ? data.amenities
      //       : ["Newly Listed"],
      //   };


      let response = await addProperty(data);
      if (response.status) {
        toast.success("Property submitted for admin approval!");
        onCancel();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message, "Failed to publish property");
    }
  };
  const values = watch();

  useEffect(() => {
    console.log(errors, "errrors");
  }, [errors]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 max-w-4xl animate-slide-up">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
        Add New Property Listing
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Property Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Home size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. Modern Glass Villa in Hollywood Hills"
                className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.title ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Monthly Rent
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-slate-400" />
              </div>
              <input
                type="number"
                {...register("price")}
                placeholder="5000"
                className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.price ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 md:col-span-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                {...register("bedrooms")}
                placeholder="3"
                className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.bedrooms ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
              />
              {errors.bedrooms && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                {...register("bathrooms")}
                step="0.5"
                placeholder="2.5"
                className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.bathrooms ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
              />
              {errors.bathrooms && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Square Feet
              </label>
              <input
                type="number"
                {...register("sqft")}
                placeholder="2500"
                className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.sqft ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
              />
              {errors.sqft && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.sqft.message}
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Property Type
            </label>
            <select
              {...register("type")}
              className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.type ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
            >
              {propertyTypeOptions.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption === "flat" ? "Flat" : typeOption}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Is Furnished
            </label>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="true"
                  {...register("isFurnished", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all peer-checked:bg-primary-600 peer-checked:text-white peer-checked:shadow-sm">
                  Yes
                </span>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="false"
                  {...register("isFurnished", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all peer-checked:bg-primary-600 peer-checked:text-white peer-checked:shadow-sm">
                  No
                </span>
              </label>
              {errors.isFurnished && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.isFurnished.message}
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Amenities
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsAmenitiesDropdownOpen((previousState) => !previousState)
                }
                className="w-full px-4 py-3 text-left bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-700"
              >
                {selectedAmenities.length
                  ? selectedAmenities.join(", ")
                  : "Select amenities"}
              </button>

              {isAmenitiesDropdownOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-3 max-h-56 overflow-y-auto space-y-2">
                  {amenitiesOptions.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              {...register("description")}
              placeholder="Describe the property details, neighborhood, and unique features..."
              className={`block w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-y ${errors.description ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    {...register("address.street")}
                    placeholder="Street address"
                    className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.address?.street ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
                  />
                </div>
                {errors.address?.street && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address.street.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register("address.city")}
                  placeholder="City"
                  className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.address?.city ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
                />
                {errors.address?.city && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address.city.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register("address.state")}
                  placeholder="State"
                  className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.address?.state ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
                />
                {errors.address?.state && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address.state.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register("address.zipCode")}
                  placeholder="ZIP Code"
                  className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.address?.zipCode ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
                />
                {errors.address?.zipCode && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address.zipCode.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register("address.country")}
                  placeholder="Country"
                  className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.address?.country ? "border-red-300 focus:ring-red-400" : "border-slate-200"}`}
                />
                {errors.address?.country && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Property Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageSelect}
              disabled={images.length >= 6}
              className="block w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-700 file:font-medium hover:file:bg-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {images.length >= 6 && (
              <p className="text-xs text-red-500 mt-1">
                Maximum 6 images allowed.
              </p>
            )}
            {isUploadingImage && (
              <p className="text-sm text-slate-500 mt-2">
                Uploading image(s) to Cloudinary...
              </p>
            )}
            {imageUploadError && (
              <p className="text-sm text-red-600 mt-2">{imageUploadError}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={img} className="relative group">
                  <img
                    src={img}
                    alt={`Property image ${idx + 1}`}
                    className="h-32 w-32 object-cover rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => onImageRemove(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail uploader */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="block w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-700 file:font-medium hover:file:bg-slate-300"
            />
            {selectedThumbnailFile && (
              <p className="text-sm text-slate-500 mt-2">
                {isUploadingThumbnail
                  ? "Uploading thumbnail to Cloudinary..."
                  : `Selected: ${selectedThumbnailFile.name}`}
              </p>
            )}
            {/* Removed thumbnail URL input field, only file upload and preview remain */}
            {thumbnailUploadError && (
              <p className="text-sm text-red-600 mt-2">
                {thumbnailUploadError}
              </p>
            )}
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Uploaded thumbnail preview"
                className="mt-4 h-32 w-full sm:w-60 object-cover rounded-xl border border-slate-200"
              />
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
