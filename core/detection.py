import cv2
from ultralytics import YOLO

def detect_faces(image_path, model_path="model.pt"):
    # 1. Load the YOLO face model
    try:
        model = YOLO(model_path)
    except Exception as e:
        print(f"Error loading model: {e}")
        return None, []

    # 2. Read the uploaded/input image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image at {image_path}")
        return None, []

    # 3. Run inference
    results = model.predict(source=image, conf=0.5, save=False)
    
    # 4. Extract data and draw bounding boxes
    boxes = results[0].boxes
    coords = []
    
    print(f"Found {len(boxes)} face(s) in the image.\n")
    
    # Loop through each detected face
    for i, box in enumerate(boxes):
        # Extract integer coordinates: (x_min, y_min, x_max, y_max)
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        
        # Format coordinate string
        coord_str = f"Face {i + 1} → ({x1}, {y1}, {x2}, {y2})"
        coords.append(coord_str)
        print(coord_str)
        
        # Draw a green bounding box on the image (BGR format)
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        # Add a label above the box
        label = f"Face {i + 1}"
        cv2.putText(image, label, (x1, max(y1 - 10, 0)), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # 5. Save the result locally
    output_path = "output_faces.jpg"
    cv2.imwrite(output_path, image)
    print(f"\nSaved image with bounding boxes to: {output_path}")

    # Return the processed image array and coordinates list for Streamlit
    return image, coords

# ==========================================
# Run the function locally
# ==========================================
if __name__ == "__main__":
    input_image = "./test_images/localTestImage.jpg" 
    detect_faces(input_image)