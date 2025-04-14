<!DOCTYPE html>
<html>

<head>
    <title>State Machine Diagram</title>
    @vite('resources/css/app.css')
</head>

<body>
    <div class="flex flex-col items-center p-10 text-center">
        <div class="flex flex-wrap justify-center gap-10 w-full max-w-7xl">
            <div class="flex flex-col items-center md:basis-2/3">
                <h3 class="text-lg font-semibold mb-2">State Machine Diagram</h3>
                <img src="{{ $smdPlantumlUrl }}" alt="State Machine Diagram" class="w-full" />
            </div>
        </div>
    </div>
</body>

</html>
